import {
  Chart,
  CategoryScale,
  LinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  PieController,
} from 'chart.js';

// Register Chart.js components
Chart.register(CategoryScale, LinearScale, ArcElement, Title, Tooltip, Legend, PieController);
