import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { DetalhesProcesso } from './pages/DetalhesProcesso';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Navigate to='/processos' replace />} />
        <Route path='/processos' element={<Dashboard />} />
        <Route path='/processos/:id' element={<DetalhesProcesso />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
