import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../hooks/useAuth';
import { api, ApiError } from '../services/api';
import { Alert, Button, FieldError, Input, Label, Muted, Panel, Shell, Textarea } from '../styles';
import type { NewNote } from '../types';

const Topbar = styled.header`border-bottom: 1px solid #e1e6df; background: #fff;`;
const TopbarInner = styled(Shell)`min-height: 74px; display: flex; justify-content: space-between; align-items: center; gap: 16px;`;
const Brand = styled.strong`font-size: 18px; letter-spacing: -.03em;`;
const HeaderActions = styled.div`display: flex; align-items: center; gap: 16px;`;
const Email = styled.span`color: #65736a; font-size: 13px; @media (max-width: 540px) { display: none; }`;
const Main = styled(Shell)`padding: 48px 0 80px;`;
const Intro = styled.div`margin-bottom: 30px; h1 { font-size: clamp(28px, 5vw, 38px); letter-spacing: -.04em; margin: 0 0 7px; } p { margin: 0; }`;
const Layout = styled.div`display: grid; grid-template-columns: minmax(270px, 340px) minmax(0, 1fr); align-items: start; gap: 24px; @media (max-width: 760px) { grid-template-columns: 1fr; }`;
const Editor = styled(Panel)`padding: 24px; h2 { font-size: 18px; margin: 0 0 20px; }`;
const Form = styled.form`display: grid; gap: 17px;`;
const NotesSection = styled.section`h2 { font-size: 18px; margin: 0 0 18px; }`;
const NotesList = styled.div`display: grid; gap: 14px;`;
const NoteCard = styled(Panel)`padding: 22px 24px; h3 { font-size: 18px; margin: 0 0 12px; overflow-wrap: anywhere; } p { white-space: pre-wrap; overflow-wrap: anywhere; line-height: 1.6; margin: 0 0 20px; } time { color: #728077; font-size: 12px; }`;
const Empty = styled(Panel)`padding: 32px; text-align: center; color: #65736a;`;

export function NotesPage() {
  const { user, clearUser } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [logoutError, setLogoutError] = useState('');
  const { register, handleSubmit, reset, formState: { errors } } = useForm<NewNote>();
  const notesQuery = useQuery({ queryKey: ['notes'], queryFn: async () => (await api.notes()).notes });
  const createMutation = useMutation({
    mutationFn: api.createNote,
    onSuccess: async () => { reset(); await queryClient.invalidateQueries({ queryKey: ['notes'] }); },
  });
  const logoutMutation = useMutation({ mutationFn: api.logout, onSuccess: () => { clearUser(); navigate('/login', { replace: true }); }, onError: (error) => setLogoutError(error.message) });

  async function submit(data: NewNote) { await createMutation.mutateAsync(data).catch(() => undefined); }

  return <>
    <Topbar><TopbarInner>
      <Brand>Anotações pessoais</Brand>
      <HeaderActions><Email>{user?.email}</Email><Button $secondary type="button" onClick={() => logoutMutation.mutate()} disabled={logoutMutation.isPending}>Sair</Button></HeaderActions>
    </TopbarInner></Topbar>
    <Main>
      <Intro><h1>Suas anotações</h1><Muted>Um lugar tranquilo para registrar o que importa.</Muted></Intro>
      {logoutError && <Alert role="alert">{logoutError}</Alert>}
      <Layout>
        <Editor>
          <h2>Nova anotação</h2>
          <Form onSubmit={handleSubmit(submit)} noValidate>
            <Label>Título
              <Input placeholder="Dê um nome à sua ideia" aria-invalid={!!errors.title} {...register('title', { required: 'Informe um título.', maxLength: { value: 120, message: 'Use no máximo 120 caracteres.' } })} />
              {errors.title && <FieldError role="alert">{errors.title.message}</FieldError>}
            </Label>
            <Label>Conteúdo
              <Textarea placeholder="Escreva aqui…" aria-invalid={!!errors.content} {...register('content', { required: 'Escreva o conteúdo.', maxLength: { value: 10000, message: 'Use no máximo 10.000 caracteres.' } })} />
              {errors.content && <FieldError role="alert">{errors.content.message}</FieldError>}
            </Label>
            {createMutation.isError && <Alert role="alert">{createMutation.error.message}</Alert>}
            <Button type="submit" disabled={createMutation.isPending}>{createMutation.isPending ? 'Salvando…' : 'Salvar anotação'}</Button>
          </Form>
        </Editor>
        <NotesSection>
          <h2>Anotações {notesQuery.data ? `(${notesQuery.data.length})` : ''}</h2>
          {notesQuery.isPending && <Muted>Carregando anotações…</Muted>}
          {notesQuery.isError && <Alert role="alert">{notesQuery.error instanceof ApiError && notesQuery.error.status === 401 ? 'Sua sessão expirou. Entre novamente.' : notesQuery.error.message}</Alert>}
          {notesQuery.data?.length === 0 && <Empty>Você ainda não tem anotações. Crie a primeira ao lado.</Empty>}
          <NotesList>{notesQuery.data?.map(note => <NoteCard key={note.id}>
            <h3>{note.title}</h3><p>{note.content}</p>
            <time dateTime={note.createdAt}>Criada em {new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium' }).format(new Date(note.createdAt))}</time>
          </NoteCard>)}</NotesList>
        </NotesSection>
      </Layout>
    </Main>
  </>;
}
