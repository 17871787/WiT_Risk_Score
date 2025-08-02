# GHG WHAT-IF Tool Architecture Diagram

## System Architecture Overview

```mermaid
graph TB
    subgraph "User Interface Layer"
        A[App.tsx<br/>Entry Point]
        A --> B[ViewProvider<br/>Tab Management]
        B --> C[Header<br/>+ Export Button]
        B --> D[Sidebar<br/>Navigation]
        B --> E[Dashboard Router<br/>Lazy Loading]
    end

    subgraph "Dashboard Views"
        E --> F[BasicDashboard<br/>Main Parameters]
        E --> G[FarmDashboard<br/>Detailed Config]
        E --> H[HeiferDashboard<br/>Reproduction]
        E --> I[SequestrationDashboard<br/>Carbon + Pathways]
        E --> J[EffectivenessDashboard<br/>LME + NUE]
        E --> K[ScenarioDashboard<br/>What-If Analysis]
        E --> L[FinancingDashboard<br/>Green Loans]
    end

    subgraph "State Management"
        M[Zustand Store<br/>FarmContext.tsx]
        M --> N[Parameters<br/>40+ fields]
        M --> O[Actions<br/>update/reset]
        M --> P[Loan Data<br/>amount/term]
    end

    subgraph "Calculation Engine"
        Q[emissions.ts<br/>- Enteric CH4<br/>- Manure<br/>- Feed<br/>- N2O]
        R[lme.ts<br/>Lifetime Methane<br/>Efficiency]
        S[nue.ts<br/>Nitrogen Use<br/>Efficiency]
        T[carbonFloor.ts<br/>Theoretical<br/>Minimum]
        U[reductionPathway.ts<br/>8 Measures<br/>+ ROI]
        V[greenFinancing.ts<br/>5 Finance<br/>Options]
        W[risk.ts<br/>Composite<br/>Risk Score]
    end

    subgraph "Custom Hooks"
        X[useCalculations<br/>Memoized results]
        Y[useGlidePath<br/>10-year projections]
        Z[useNue<br/>N balance]
    end

    subgraph "Components"
        AA[Charts<br/>- LMEDisplay<br/>- NUEDisplay<br/>- ReductionPathway<br/>- NetCarbonProjection]
        AB[Parameters<br/>- Sliders<br/>- Selects<br/>- Toggles]
        AC[Scenarios<br/>- Builder<br/>- Comparison<br/>- Financing]
    end

    subgraph "Export System"
        AD[exportData.ts]
        AD --> AE[CSV Export]
        AD --> AF[JSON Export]
        AD --> AG[PDF/Print]
    end

    %% Data Flow
    D -.-> M
    F & G & H --> AB
    AB --> M
    M --> X & Y & Z
    X --> Q & R & S & T & U & V & W
    Y --> T
    Z --> S
    
    X & Y & Z --> AA
    AA --> F & I & J
    
    K --> AC
    AC --> M
    AC --> V
    
    L --> V & U
    
    C --> AD
    M --> AD
    X --> AD

    %% Styling
    classDef dashboard fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    classDef state fill:#f3e5f5,stroke:#4a148c,stroke-width:2px
    classDef calc fill:#e8f5e9,stroke:#1b5e20,stroke-width:2px
    classDef component fill:#fff3e0,stroke:#e65100,stroke-width:2px
    classDef export fill:#ffebee,stroke:#b71c1c,stroke-width:2px
    
    class F,G,H,I,J,K,L dashboard
    class M,N,O,P state
    class Q,R,S,T,U,V,W calc
    class AA,AB,AC component
    class AD,AE,AF,AG export
```

## Data Flow Diagram

```mermaid
graph LR
    subgraph "Input"
        A[User Input]
        B[Parameter Changes]
        C[Scenario Toggles]
    end

    subgraph "State Layer"
        D[Zustand Store]
        E[Farm Parameters]
        F[Loan Parameters]
    end

    subgraph "Calculation Layer"
        G[Emissions Calc]
        H[LME Calc]
        I[NUE Calc]
        J[TM Calc]
        K[Risk Calc]
    end

    subgraph "Hook Layer"
        L[useCalculations]
        M[Memoization]
        N[Derived State]
    end

    subgraph "UI Layer"
        O[Components]
        P[Charts]
        Q[Dashboards]
    end

    subgraph "Output"
        R[Display]
        S[Export]
        T[Reports]
    end

    A & B & C --> D
    D --> E & F
    E --> G & H & I & J & K
    G & H & I & J & K --> L
    L --> M --> N
    N --> O & P
    O & P --> Q
    Q --> R
    N --> S --> T

    %% Styling
    classDef input fill:#e3f2fd,stroke:#1565c0,stroke-width:2px
    classDef state fill:#f3e5f5,stroke:#6a1b9a,stroke-width:2px
    classDef calc fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px
    classDef ui fill:#fff8e1,stroke:#f57f17,stroke-width:2px
    classDef output fill:#fce4ec,stroke:#c2185b,stroke-width:2px
    
    class A,B,C input
    class D,E,F state
    class G,H,I,J,K calc
    class O,P,Q ui
    class R,S,T output
```

## Component Hierarchy

```mermaid
graph TD
    A[App.tsx]
    A --> B[ViewProvider]
    B --> C[Header]
    B --> D[Sidebar]
    B --> E[Dashboard Container]
    
    C --> F[Metrics Display]
    C --> G[ExportButton]
    
    D --> H[OverflowTabRow]
    D --> I[FarmSummary]
    
    E --> J[BasicDashboard]
    E --> K[FarmDashboard]
    E --> L[HeiferDashboard]
    E --> M[SequestrationDashboard]
    E --> N[EffectivenessDashboard]
    E --> O[ScenarioDashboard]
    E --> P[FinancingDashboard]
    
    J --> Q[LoanCalculator]
    J --> R[FeedTuning]
    J --> S[CostBreakdown]
    J --> T[FarmImpactV2]
    
    M --> U[NetCarbonProjectionV2]
    M --> V[ReductionPathwayDisplay]
    
    N --> W[LMEDisplay]
    N --> X[NUEDisplay]
    N --> Y[LMEPlusDisplay]
    
    O --> Z[ScenarioBuilder]
    O --> AA[ScenarioComparison]
    O --> AB[ScenarioFinancing]

    %% Styling
    classDef root fill:#ffcdd2,stroke:#d32f2f,stroke-width:3px
    classDef provider fill:#e1bee7,stroke:#8e24aa,stroke-width:2px
    classDef layout fill:#c5cae9,stroke:#303f9f,stroke-width:2px
    classDef dashboard fill:#b2dfdb,stroke:#00796b,stroke-width:2px
    classDef component fill:#ffe0b2,stroke:#f57c00,stroke-width:2px
    
    class A root
    class B provider
    class C,D,E layout
    class J,K,L,M,N,O,P dashboard
    class Q,R,S,T,U,V,W,X,Y,Z,AA,AB component
```

## Calculation Flow

```mermaid
sequenceDiagram
    participant U as User
    participant S as Store
    participant H as Hook
    participant C as Calc Engine
    participant D as Display

    U->>S: Update Parameter
    S->>S: Validate Input
    S->>H: Trigger Recalc
    H->>C: Call Calculations
    
    par Parallel Calculations
        C->>C: Calculate Emissions
        C->>C: Calculate LME
        C->>C: Calculate NUE
        C->>C: Calculate Risk
    end
    
    C->>H: Return Results
    H->>H: Memoize Results
    H->>D: Update UI
    D->>U: Show Results
    
    opt Export
        U->>H: Request Export
        H->>C: Generate Full Report
        C->>U: Download File
    end
```

## Technology Stack

```mermaid
mindmap
  root((GHG Tool))
    Frontend
      React 18
      TypeScript
      Vite
      Tailwind CSS
    State
      Zustand
      Context API
    Charts
      Recharts
      Custom SVG
    Calculations
      Pure Functions
      Memoization
      TypeScript Types
    Deployment
      Vercel
      GitHub
      CI/CD Pipeline
    Features
      V1-V2
        Emissions
        LME
        Risk Score
        Loans
      V3
        NUE
        Feed Optimization
      V4
        Theoretical Minimum
        Reduction Pathways
        Green Financing
        Exports
```

---

*These diagrams provide a comprehensive view of the GHG WHAT-IF Tool architecture, data flow, component hierarchy, calculation sequence, and technology stack.*