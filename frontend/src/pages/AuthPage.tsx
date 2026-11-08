import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../hooks/useAuth';
import { api } from '../services/api';
import { Alert, Button, FieldError, Input, Label, Muted, Panel, Shell } from '../styles';
import type { Credentials } from '../types';

const Page = styled(Shell)`min-height: 100vh; display: grid; place-items: center; padding: 40px 0;`;
const AuthPanel = styled(Panel)`width: min(100%, 420px); padding: clamp(24px, 5vw, 38px);`;
const Eyebrow = styled.span`color: #2f604b; font-weight: 700; font-size: 13px; letter-spacing: .08em; text-transform: uppercase;`;
const Heading = styled.h1`font-size: clamp(28px, 5vw, 34px); line-height: 1.2; letter-spacing: -.035em; margin: 12px 0 8px;`;
const Form = styled.form`display: grid; gap: 18px; margin: 28px 0 22px;`;
const Footer = styled(Muted)`margin-bottom: 0; font-size: 14px;`;

export function AuthPage({ mode }: { mode: 'login' | 'register' }) {
  const isRegister = mode === 'register';
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Credentials>();

  if (user) return <Navigate to="/notes" replace />;

  async function submit(data: Credentials) {
    setError('');
    try {
      if (isRegister) {
        await api.register(data);
        const result = await api.login(data);
        setUser(result.user);
      } else {
        const result = await api.login(data);
        setUser(result.user);
      }
      navigate('/notes', { replace: true });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Tente novamente.');
    }
  }

  return <Page>
    <AuthPanel>
      <Eyebrow>Anotações pessoais</Eyebrow>
      <Heading>{isRegister ? 'Crie sua conta' : 'Bem-vindo de volta'}</Heading>
      <Muted>{isRegister ? 'Um espaço simples para guardar suas ideias.' : 'Entre para acessar suas anotações.'}</Muted>
      <Form onSubmit={handleSubmit(submit)} noValidate>
        <Label>E-mail
          <Input type="email" autoComplete="email" placeholder="voce@exemplo.com" aria-invalid={!!errors.email} {...register('email', { required: 'Informe seu e-mail.', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Informe um e-mail válido.' } })} />
          {errors.email && <FieldError role="alert">{errors.email.message}</FieldError>}
        </Label>
        <Label>Senha
          <Input type="password" autoComplete={isRegister ? 'new-password' : 'current-password'} placeholder="Pelo menos 8 caracteres" aria-invalid={!!errors.password} {...register('password', { required: 'Informe sua senha.', minLength: { value: 8, message: 'Use pelo menos 8 caracteres.' }, maxLength: { value: 72, message: 'Use no máximo 72 caracteres.' } })} />
          {errors.password && <FieldError role="alert">{errors.password.message}</FieldError>}
        </Label>
        {error && <Alert role="alert">{error}</Alert>}
        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Aguarde…' : isRegister ? 'Criar conta' : 'Entrar'}</Button>
      </Form>
      <Footer>{isRegister ? 'Já tem uma conta?' : 'Ainda não tem uma conta?'}{' '}
        <Link to={isRegister ? '/login' : '/register'}>{isRegister ? 'Entrar' : 'Criar conta'}</Link>
      </Footer>
    </AuthPanel>
  </Page>;
}
