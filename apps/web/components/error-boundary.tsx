'use client';
import React from 'react';

type Props = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

type State = {
  hasError: boolean;
};

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: unknown) {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.log(error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <p>Something went wrong</p>;
    }

    return this.props.children;
  }
}
