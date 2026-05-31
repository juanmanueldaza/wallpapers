#!/usr/bin/env python3
"""
GA4 Property Provisioner for daza.ar ecosystem
Creates a GA4 property + web data stream per site, configures enhanced
measurement, data retention, and cross-domain tracking.

Prerequisites:
    pip install google-analytics-admin google-auth

Usage:
    # First time: set up credentials
    export GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json

    # List all current properties
    python3 provision-ga4-properties.py --list

    # Create property for a single site
    python3 provision-ga4-properties.py --create cv

    # Create all pending sites
    python3 provision-ga4-properties.py --create-all

    # Configure enhanced measurement and data retention
    python3 provision-ga4-properties.py --configure G-XXXXXXXXXX

Auth:
    Uses a Google Cloud service account with roles:
    - GA4 Admin API: roles/analytics.admin
    Create a key at: https://console.cloud.google.com/iam-admin/serviceaccounts
    Download the JSON key and set GOOGLE_APPLICATION_CREDENTIALS.
"""

import argparse
import os
import sys
import json
from typing import Optional

# -------------------------------------------------------------------
# GA4 Admin API client setup
# -------------------------------------------------------------------
try:
    from google.analytics.admin import AnalyticsAdminServiceClient
    from google.analytics.admin_v1alpha.types import resources, analytics_admin
    from google.analytics.admin_v1alpha.types.analytics_admin import (
        CreatePropertyRequest,
        UpdateDataRetentionSettingsRequest,
        CreateDataStreamRequest,
        CreateCustomDimensionRequest,
        CreateConversionEventRequest,
    )
    from google.analytics.admin_v1alpha.types.resources import (
        Property,
        DataRetentionSettings,
        DataStream,
        CustomDimension,
        ConversionEvent,
    )
except ImportError as e:
    print(f"ERROR: Install dependencies: {e}")
    print("  pip install google-analytics-admin google-auth")
    sys.exit(1)

# -------------------------------------------------------------------
# Site registry — matches analytics-config.umd.js SITE_REGISTRY
# Each entry maps to a GA4 property that will be created
# -------------------------------------------------------------------
SITES = {
    "wallpapers": {
        "display_name": "wallpapers.daza.ar",
        "timezone": "Europe/Madrid",
        "urls": ["https://wallpapers.daza.ar"],
    },
    "cv": {
        "display_name": "cv.daza.ar",
        "timezone": "Europe/Madrid",
        "urls": ["https://cv.daza.ar"],
    },
    "start": {
        "display_name": "start.daza.ar",
        "timezone": "Europe/Madrid",
        "urls": ["https://start.daza.ar"],
    },
    "onepager": {
        "display_name": "onepager.daza.ar",
        "timezone": "Europe/Madrid",
        "urls": ["https://onepager.daza.ar"],
    },
    "mdsite": {
        "display_name": "mdsite.daza.ar",
        "timezone": "Europe/Madrid",
        "urls": ["https://mdsite.daza.ar"],
    },
    "navbar": {
        "display_name": "navbar.daza.ar",
        "timezone": "Europe/Madrid",
        "urls": ["https://navbar.daza.ar"],
    },
    "data": {
        "display_name": "data.daza.ar",
        "timezone": "Europe/Madrid",
        "urls": ["https://data.daza.ar"],
    },
    "laboratoriodeprogramacioncreativa": {
        "display_name": "laboratoriodeprogramacioncreativa.daza.ar",
        "timezone": "Europe/Madrid",
        "urls": ["https://laboratoriodeprogramacioncreativa.daza.ar"],
    },
    "spanishlessons": {
        "display_name": "Spanish Lessons daza.ar",
        "timezone": "Europe/Madrid",
        "urls": ["https://spanishlessons.daza.ar"],
    },
}

# Cross-domain groups (sites sharing the same root domain)
# Configure cross-domain tracking for these groups
CROSS_DOMAIN_GROUPS = {
    "daza.ar": [
        "wallpapers", "cv", "start", "onepager", "mdsite",
        "navbar", "data", "laboratoriodeprogramacioncreativa", "spanishlessons",
    ],
}

# -------------------------------------------------------------------
# GA4 Admin API client
# -------------------------------------------------------------------
def get_client() -> AnalyticsAdminServiceClient:
    """Create GA4 Admin API client from service account credentials."""
    creds_path = os.environ.get("GOOGLE_APPLICATION_CREDENTIALS")
    if not creds_path:
        raise RuntimeError(
            "Set GOOGLE_APPLICATION_CREDENTIALS to path of service account JSON.\n"
            "  export GOOGLE_APPLICATION_CREDENTIALS=/path/to/key.json\n"
            "Create a service account at:\n"
            "  https://console.cloud.google.com/iam-admin/serviceaccounts\n"
            "  Grant roles/analytics.admin\n"
            "  Create and download a key as JSON."
        )
    return AnalyticsAdminServiceClient.from_service_account_json(creds_path)


def get_account_id(client: AnalyticsAdminServiceClient) -> str:
    """Get the first GA4 account ID for this project."""
    for account in client.list_account_summaries():
        return account.account
    raise RuntimeError("No GA4 account found. Create one at https://analytics.google.com")


# -------------------------------------------------------------------
# Property management
# -------------------------------------------------------------------
def create_property(client: AnalyticsAdminServiceClient, account_id: str,
                    site_key: str, site_config: dict) -> str:
    """
    Create a GA4 property for a site.
    Returns the property ID (format: properties/XXXXXXXXX).
    """
    parent = f"accounts/{account_id}"
    property_name = site_config["display_name"]

    request = CreatePropertyRequest(
        property=Property(
            display_name=property_name,
            time_zone=site_config["timezone"],
            industry_category="COMPUTING_AND_TECHNOLOGY",
        ),
        parent=parent,
    )

    result = client.create_property(request)
    property_id = result.name  # e.g. "properties/1234567890"
    print(f"  [OK] Created property: {property_name} → {property_id}")

    # Enable enhanced measurement defaults by creating a web stream
    stream_id = create_web_stream(client, property_id, site_key, site_config)
    configure_enhanced_measurement(client, property_id, stream_id)
    configure_data_retention(client, property_id)
    create_custom_dimensions(client, property_id)
    create_conversion_events(client, property_id)

    return property_id


def create_web_stream(client: AnalyticsAdminServiceClient, property_id: str,
                      site_key: str, site_config: dict) -> str:
    """Create a web data stream for the property."""
    request = CreateDataStreamRequest(
        parent=property_id,
        data_stream=DataStream(
            display_name=site_config["display_name"],
            type_=DataStream.DataStreamType.WEB_DATA_STREAM,
            web_stream_data=DataStream.WebStreamData(
                default_uri=site_config["urls"][0],
            ),
        ),
    )
    result = client.create_data_stream(request)
    print(f"  [OK] Created web stream: {result.web_stream_data.measurement_id}")
    return result.name


def configure_enhanced_measurement(client: AnalyticsAdminServiceClient,
                                    property_id: str, stream_id: str) -> None:
    """
    Configure enhanced measurement settings via PATCH on the stream.
    Note: The python client may not expose enhanced measurement fields directly.
    This is a placeholder — in practice, use the REST API directly for EM config:
      PATCH https://analyticsadmin.googleapis.com/v1beta/{stream_id}
      {"enhancedMeasurementSettings": {"scrolls": true, "outboundClicks": true, ...}}
    For now, recommend enabling via GA4 UI or using gtag config flags per site.
    """
    # Enhanced measurement must be configured via REST API directly
    # The Python SDK doesn't fully expose EM settings yet.
    # See: https://developers.google.com/analytics/devguides/config/admin/v1/rest/v1beta/properties.dataStreams
    print("  [NOTE] Enhanced measurement: configure manually in GA4 UI or via REST API")
    print("         Enable: scrolls, outbound clicks, site search, video engagement, file downloads")


def configure_data_retention(client: AnalyticsAdminServiceClient, property_id: str) -> None:
    """Set data retention to 14 months (GA4 max) for user-level and event-level data."""
    request = UpdateDataRetentionSettingsRequest(
        name=f"{property_id}/dataRetentionSettings",
        property=DataRetentionSettings(
            user_data_retention=DataRetentionSettings.RetentionDuration.FOURTEEN_MONTHS,
            event_data_retention=DataRetentionSettings.RetentionDuration.FOURTEEN_MONTHS,
        ),
        update_mask="user_data_retention,event_data_retention",
    )
    try:
        client.update_data_retention_settings(request)
        print("  [OK] Data retention: 14 months (user + event)")
    except Exception as e:
        print(f"  [WARN] Could not set data retention: {e}")
        print("         Check that your service account has roles/analytics.admin")


def create_custom_dimensions(client: AnalyticsAdminServiceClient, property_id: str) -> None:
    """
    Create custom dimensions shared across all daza.ar properties.
    These are referenced in Looker Studio blended reports for cross-property queries.
    """
    dimensions = [
        ("site_key", "Site Key", "TEXT", "The daza.ar subsite identifier (e.g. wallpapers, cv)"),
        ("page_type", "Page Type", "TEXT", "Category of the page (home, tool, landing, docs)"),
        ("tool_name", "Tool Name", "TEXT", "Tool being used (for tool pages)"),
        ("export_format", "Export Format", "TEXT", "File format of export (md, json, pdf)"),
    ]

    for dim_key, display_name, description, scope in [
        ("site_key", "Site Key", "TEXT", "The daza.ar subsite identifier"),
        ("page_type", "Page Type", "TEXT", "Category of page"),
        ("tool_name", "Tool Name", "TEXT", "Tool name for tool pages"),
    ]:
        try:
            request = CreateCustomDimensionRequest(
                parent=property_id,
                custom_dimension=CustomDimension(
                    parameter_name=dim_key,
                    display_name=display_name,
                    description=description,
                    scope=CustomDimension.DimensionScope.EVENT,
                ),
            )
            client.create_custom_dimension(request)
            print(f"  [OK] Custom dimension: {dim_key}")
        except Exception as e:
            if "already exists" in str(e).lower() or "ALREADY_EXISTS" in str(e):
                print(f"  [--] Custom dimension '{dim_key}' already exists — skipping")
            else:
                print(f"  [WARN] Could not create dimension '{dim_key}': {e}")


def create_conversion_events(client: AnalyticsAdminServiceClient, property_id: str) -> None:
    """Mark recommended events as conversions."""
    conversion_events = [
        "file_download",
        "form_submit",
        "tool_export",
        "cta_click",
        "search",
    ]

    for event_name in conversion_events:
        try:
            request = CreateConversionEventRequest(
                parent=property_id,
                conversion_event=ConversionEvent(event_name=event_name),
            )
            client.create_conversion_event(request)
            print(f"  [OK] Conversion event: {event_name}")
        except Exception as e:
            if "already exists" in str(e).lower() or "ALREADY_EXISTS" in str(e):
                print(f"  [--] Conversion event '{event_name}' already exists — skipping")
            else:
                print(f"  [WARN] Could not create conversion '{event_name}': {e}")


def list_properties(client: AnalyticsAdminServiceClient) -> None:
    """List all GA4 properties in the account."""
    account_id = get_account_id(client)
    print(f"\nAccount: {account_id}\n")
    print(f"{'Display Name':<40} {'Property ID':<25} {'Measurement ID'}")
    print("-" * 90)

    for summary in client.list_account_summaries():
        if not summary.property:
            continue
        # Get property details
        try:
            prop = client.get_property(name=summary.property)
            # Get measurement ID from stream
            streams = list(client.list_data_streams(parent=summary.property))
            meas_id = ""
            for s in streams:
                if s.web_stream_data:
                    meas_id = s.web_stream_data.measurement_id
                    break
            print(f"{prop.display_name:<40} {summary.property:<25} {meas_id}")
        except Exception:
            print(f"{summary.property:<40} {summary.property:<25} (no access)")


# -------------------------------------------------------------------
# CLI
# -------------------------------------------------------------------
def main():
    parser = argparse.ArgumentParser(description="GA4 Property Provisioner for daza.ar")
    parser.add_argument("--list", action="store_true", help="List all GA4 properties")
    parser.add_argument("--create", metavar="SITE_KEY", help="Create property for a single site")
    parser.add_argument("--create-all", action="store_true", help="Create properties for all pending sites")
    parser.add_argument("--configure", metavar="PROPERTY_ID", help="Configure an existing property")
    args = parser.parse_args()

    client = get_client()
    account_id = get_account_id(client)
    print(f"Using GA4 account: {account_id}")

    if args.list:
        list_properties(client)
        return

    if args.create:
        if args.create not in SITES:
            print(f"Unknown site key: {args.create}")
            print(f"Available: {', '.join(SITES.keys())}")
            return
        prop_id = create_property(client, account_id, args.create, SITES[args.create])
        print(f"\nDone! Add to analytics-config.umd.js:")
        print(f"  {args.create}: {{ measurementId: '<from property>', propertyId: '{prop_id}' }}")
        print(f"\nGet measurement ID from: GA4 Admin → {SITES[args.create]['display_name']} → Data Streams")
        return

    if args.create_all:
        created = {}
        for site_key, site_config in SITES.items():
            print(f"\n--- Creating property for: {site_key} ---")
            prop_id = create_property(client, account_id, site_key, site_config)
            created[site_key] = prop_id
        print("\n\n=== ALL PROPERTIES CREATED ===")
        print(f"{'Site Key':<40} {'Property ID':<25} {'Measurement ID'}")
        print("-" * 90)
        for site_key, prop_id in created.items():
            print(f"{site_key:<40} {prop_id}")
        return

    if args.configure:
        # Re-configure an existing property
        configure_data_retention(client, args.configure)
        create_custom_dimensions(client, args.configure)
        create_conversion_events(client, args.configure)
        return

    parser.print_help()


if __name__ == "__main__":
    main()