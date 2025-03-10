import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: "20px",
            color: "white",
            textAlign: "center",
          }}
        >
          <h2>Something went wrong</h2>
          <p>Please try refreshing the page</p>
          {import.meta.env.DEV && (
            <pre
              style={{
                textAlign: "left",
                margin: "20px",
                padding: "10px",
                background: "rgba(255,255,255,0.1)",
              }}
            >
              {this.state.error?.toString()}
            </pre>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
