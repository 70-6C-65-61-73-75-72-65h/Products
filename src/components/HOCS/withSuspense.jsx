import React from "react";

export function withSuspense(WrappedComponent) {
  return (props) => {
    return (
      <React.Suspense fallback={<div>loading...</div>}>
        <WrappedComponent {...props} />
      </React.Suspense>
    );
  };
}
