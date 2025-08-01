# GHG WHAT-IF Tool

A comprehensive React/TypeScript application for dairy farm greenhouse gas (GHG) optimization and carbon footprint analysis.

## Features

- **Real-time GHG calculations** with seasonal adjustments
- **Lifetime Methane Efficiency (LME)** tracking
- **Carbon sequestration** planning and tracking
- **Economic analysis** with cost breakdowns
- **10-year carbon projection** modeling
- **Green financing** recommendations
- **Export functionality** for comprehensive CSV reports

## Architecture

The application has been refactored from a monolithic 4000+ line component into a modular, maintainable architecture:

```
src/
├── components/          # UI components
│   ├── charts/         # Data visualization components
│   ├── parameters/     # Parameter input components
│   └── ui/            # Reusable UI elements
├── constants/          # Application constants
├── context/           # State management (Zustand)
├── hooks/             # Custom React hooks
├── lib/               # Business logic
│   ├── calculations/  # Core calculation functions
│   └── utils/         # Utility functions
└── types/             # TypeScript type definitions
```

## Key Improvements

### Performance
- Memoized calculations using `useMemo`
- Efficient state management with Zustand
- Optimized re-renders with proper component splitting

### Safety
- Safe division operations preventing division by zero
- Input validation and sanitization
- TypeScript for type safety
- Comprehensive error handling

### Maintainability
- Modular component architecture
- Separated business logic from UI
- Comprehensive test coverage
- Clear separation of concerns

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm start

# Run tests
npm test

# Build for production
npm run build
```

## Technologies

- React 18
- TypeScript
- Zustand (state management)
- Recharts (data visualization)
- Tailwind CSS (styling)
- Jest (testing)

## Key Calculations

### Emissions
- Enteric fermentation
- Manure management
- Feed production
- Deforestation impact
- Nitrogen application

### Sequestration
- Tree planting
- Hedgerow restoration
- Soil carbon management
- Cover crops
- Renewable energy
- Technology solutions

### Performance Metrics
- Emissions intensity (kg CO₂e/L)
- Lifetime Methane Efficiency (LME)
- Feed efficiency
- Protein efficiency
- Nitrogen efficiency
- Overall herd effectiveness

## Testing

The application includes comprehensive unit tests for:
- Mathematical utilities
- Emission calculations
- LME calculations
- Input validation

Run tests with:
```bash
npm test
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.