import React, { createContext, useContext, useState, useEffect } from "react";

// Router Context
const RouterContext = createContext<{
  path: string;
  navigate: (to: string, options?: { replace?: boolean }) => void;
} | null>(null);

export function RouterProvider({ children }: { children: React.ReactNode }) {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setPath(window.location.pathname);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigate = (to: string, options?: { replace?: boolean }) => {
    // Standardize TanStack Router paths with parameters, e.g., to="/app/spaces/$id" with params={id: "space-1"}
    if (options?.replace) {
      window.history.replaceState(null, "", to);
    } else {
      window.history.pushState(null, "", to);
    }
    setPath(to);
  };

  return (
    <RouterContext.Provider value={{ path, navigate }}>
      {children}
    </RouterContext.Provider>
  );
}

export function useRouter() {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error("useRouter must be used within a RouterProvider");
  }
  return context;
}

// TanStack Router compatibility hooks & functions
export function useNavigate() {
  const { navigate } = useRouter();
  
  return (toObj: any) => {
    if (typeof toObj === "string") {
      navigate(toObj);
    } else if (toObj && toObj.to) {
      let targetPath = toObj.to;
      // Handle params replacement like /app/spaces/$id -> /app/spaces/space-1
      if (toObj.params) {
        Object.entries(toObj.params).forEach(([key, val]) => {
          targetPath = targetPath.replace(`$${key}`, String(val));
        });
      }
      navigate(targetPath, { replace: toObj.replace });
    }
  };
}

export function Link({
  to,
  params,
  className,
  children,
  onClick,
  ...props
}: {
  to: string;
  params?: Record<string, any>;
  className?: string;
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  [key: string]: any;
}) {
  const { navigate } = useRouter();

  let resolvedPath = to;
  if (params) {
    Object.entries(params).forEach(([key, val]) => {
      resolvedPath = resolvedPath.replace(`$${key}`, String(val));
    });
  }

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) onClick(e);
    
    // Don't intercept cmd/ctrl clicks for new tabs
    if (!e.defaultPrevented && e.button === 0 && !e.metaKey && !e.ctrlKey) {
      e.preventDefault();
      navigate(resolvedPath);
    }
  };

  return (
    <a href={resolvedPath} className={className} onClick={handleClick} {...props}>
      {children}
    </a>
  );
}

// Dummy createFileRoute to satisfy Route definitions
export function createFileRoute(path: string) {
  return (options: {
    head?: () => { meta: Array<Record<string, any>> };
    loader?: (ctx: any) => Promise<void> | void;
    component: React.ComponentType<any>;
  }) => {
    // Side effect for document head if configured
    if (options.head) {
      const headData = options.head();
      if (headData.meta) {
        headData.meta.forEach(meta => {
          if (meta.title) {
            document.title = meta.title;
          }
          if (meta.name === "description" && meta.content) {
            let metaDesc = document.querySelector('meta[name="description"]');
            if (!metaDesc) {
              metaDesc = document.createElement("meta");
              metaDesc.setAttribute("name", "description");
              document.head.appendChild(metaDesc);
            }
            metaDesc.setAttribute("content", meta.content);
          }
        });
      }
    }
    
    return {
      path,
      component: options.component,
      loader: options.loader,
    };
  };
}
