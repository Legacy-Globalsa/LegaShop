import { Component, type ErrorInfo, type ReactNode } from "react";
import { VendorErrorState } from "@/components/vendor/VendorState";

interface VendorErrorBoundaryProps {
  children: ReactNode;
  resetKey: string;
}

interface VendorErrorBoundaryState {
  error: Error | null;
  resetKey: string;
}

class VendorErrorBoundary extends Component<VendorErrorBoundaryProps, VendorErrorBoundaryState> {
  state: VendorErrorBoundaryState = {
    error: null,
    resetKey: this.props.resetKey,
  };

  static getDerivedStateFromError(error: Error): Partial<VendorErrorBoundaryState> {
    return { error };
  }

  static getDerivedStateFromProps(
    props: VendorErrorBoundaryProps,
    state: VendorErrorBoundaryState
  ): Partial<VendorErrorBoundaryState> | null {
    if (props.resetKey !== state.resetKey) {
      return { error: null, resetKey: props.resetKey };
    }
    return null;
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Vendor route error", error, info);
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <VendorErrorState
        title="Vendor page crashed"
        description="This page hit an unexpected rendering error."
        onRetry={() => this.setState({ error: null })}
      />
    );
  }
}

export default VendorErrorBoundary;
