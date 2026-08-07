import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { DetalhesProcesso } from './pages/DetalhesProcesso';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { VerifyEmail } from './pages/VerifyEmail';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';
import { RequireAuth } from './components/RequireAuth';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Navigate to='/processos' replace />} />
        <Route path='/login' element={<Login />} />
        <Route path='/cadastro' element={<Signup />} />
        <Route path='/verificar-email' element={<VerifyEmail />} />
        <Route path='/esqueci-senha' element={<ForgotPassword />} />
        <Route path='/redefinir-senha' element={<ResetPassword />} />

        <Route element={<RequireAuth />}>
          <Route path='/processos' element={<Dashboard />} />
          <Route path='/processos/:id' element={<DetalhesProcesso />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
