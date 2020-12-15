import React from "react";

export function withSuspense(WrappedComponent) {
  return (props) => {
    return (
      <React.Suspense
        fallback={
          <div
            style={{
              backgroundColor: "white",
              textAlign: "center",
              fontSize: "40px",
            }}
          >
            Loading...
          </div>
        }
      >
        <WrappedComponent {...props} />
      </React.Suspense>
    );
  };
}
