import React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dashboard-layout">
      <header className="dashboard-header">
        <div className="container">
          <h1>Hi Girl Dashboard</h1>
        </div>
      </header>
      <main className="dashboard-main">
        {children}
      </main>
    </div>
  );
}
