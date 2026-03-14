import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#1F2933', direction: 'rtl' }}>
          <h1 style={{ color: '#0F766E' }}>حدث خطأ</h1>
          <p>حدث خطأ غير متوقع. يرجى التقاط صورة لهذه الشاشة وإرسالها للمطور.</p>
          <div style={{ marginTop: '2rem', textAlign: 'left', direction: 'ltr', background: '#ffebee', padding: '1rem', borderRadius: '8px', overflowX: 'auto', fontSize: '0.85rem' }}>
            <h3 style={{ color: '#c62828', marginTop: 0 }}>Error Details:</h3>
            <p style={{ fontWeight: 'bold', color: '#b71c1c' }}>{this.state.error && this.state.error.toString()}</p>
            <pre style={{ color: '#c62828', whiteSpace: 'pre-wrap' }}>
              {this.state.errorInfo && this.state.errorInfo.componentStack}
            </pre>
          </div>
          <button onClick={() => window.location.reload()} style={{ padding: '0.8rem 1.5rem', marginTop: '2rem', cursor: 'pointer', background: '#0F766E', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem' }}>
            تحديث الصفحة (Reload Page)
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
