import { createGlobalStyle, styled } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  :root { font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; color: #24302b; background: #f6f7f3; font-synthesis: none; }
  * { box-sizing: border-box; }
  body { margin: 0; min-width: 320px; }
  button, input, textarea { font: inherit; }
  button { cursor: pointer; }
  a { color: #2f604b; }
  :focus-visible { outline: 3px solid #8cb49a; outline-offset: 2px; }
`;

export const Shell = styled.div`
  width: min(100% - 40px, 980px);
  margin: 0 auto;
`;

export const Panel = styled.section`
  background: #fff;
  border: 1px solid #e1e6df;
  border-radius: 16px;
  box-shadow: 0 8px 28px rgb(25 55 36 / 4%);
`;

export const Button = styled.button<{ $secondary?: boolean }>`
  border: 1px solid ${({ $secondary }) => $secondary ? '#cbd8cf' : '#2f604b'};
  border-radius: 10px;
  background: ${({ $secondary }) => $secondary ? '#fff' : '#2f604b'};
  color: ${({ $secondary }) => $secondary ? '#2f604b' : '#fff'};
  padding: 11px 17px;
  font-weight: 650;
  transition: background .15s ease, transform .15s ease;
  &:hover:not(:disabled) { background: ${({ $secondary }) => $secondary ? '#eef4ef' : '#244b3a'}; transform: translateY(-1px); }
  &:disabled { opacity: .6; cursor: wait; }
`;

export const Label = styled.label`
  display: grid;
  gap: 7px;
  font-size: 14px;
  font-weight: 600;
`;

const fieldStyle = `
  width: 100%;
  border: 1px solid #cbd4cd;
  border-radius: 10px;
  background: #fff;
  color: #24302b;
  padding: 12px 13px;
  outline: none;
  &:focus { border-color: #2f604b; box-shadow: 0 0 0 3px #e1eee5; }
  &::placeholder { color: #88958c; }
`;

export const Input = styled.input`${fieldStyle}`;
export const Textarea = styled.textarea`${fieldStyle} min-height: 125px; resize: vertical;`;
export const FieldError = styled.span`color: #a33b39; font-size: 13px; font-weight: 500;`;
export const Alert = styled.p`color: #8e332f; background: #fff1ef; border: 1px solid #f0d3d0; border-radius: 10px; padding: 11px 13px; margin: 0;`;
export const Muted = styled.p`color: #65736a;`;
