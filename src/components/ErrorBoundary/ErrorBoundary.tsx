import React, { ReactNode } from 'react';

import './ErrorBoundary.css';

interface ErrorBoundaryState {
  hasError: boolean;
  error: null | Error;
  errorInfo: null | React.ErrorInfo;
}

class ErrorBoundary extends React.Component<
  { children: ReactNode },
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    error: null,
    errorInfo: null,
    hasError: false,
  };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.log('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
  }

  render() {
    if (this.state.hasError && this.state.errorInfo) {
      return (
        <div className="error">
          <h2 className="error__title">Something went wrong</h2>
          <details className="error__details">
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
