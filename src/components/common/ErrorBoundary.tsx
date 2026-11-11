import { Component, ErrorInfo, ReactNode } from 'react';
import { storageService } from '../../services/storageService';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackMessage?: string;
  onReset?: () => void;
  componentContext?: string;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorMessage: '',
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMessage: error.message };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Record internal diagnostic error log silently for teachers/developers
    storageService.logDevError({
      id: 'err_' + Date.now(),
      timestamp: new Date().toISOString(),
      code: 'UI_ERROR_BOUNDARY_CAUGHT',
      message: `Error caught in ${this.props.componentContext || 'Unknown Component'}: ${error.message}`,
      details: `${error.stack || ''}\nComponent Stack: ${errorInfo.componentStack}`,
      context: {
        phase: 'componentDidCatch',
      },
      resolved: false,
    });
  }

  private handleRetry = () => {
    this.setState({ hasError: false, errorMessage: '' });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 rounded-2xl bg-amber-50/80 border border-amber-200 text-center max-w-lg mx-auto my-6 shadow-xs">
          <div className="w-16 h-16 mx-auto mb-4 bg-amber-100 rounded-full flex items-center justify-center text-3xl">
            🌱
          </div>
          <h3 className="font-display text-xl font-bold text-[#263238] mb-2">
            {this.props.fallbackTitle || 'Media belum dapat dibuka'}
          </h3>
          <p className="text-sm text-[#68737D] leading-relaxed mb-6">
            {this.props.fallbackMessage ||
              'Coba muat ulang aktivitas ini. Jika masalah masih terjadi, beri tahu gurumu agar dibantu.'}
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={this.handleRetry}
              className="px-5 py-2.5 bg-[#4D96FF] hover:bg-blue-600 text-white font-semibold rounded-xl text-sm transition-all shadow-xs active:scale-95 cursor-pointer"
            >
              🔄 Coba Lagi
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
