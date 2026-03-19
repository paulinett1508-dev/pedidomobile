export interface PedidoItem {
  pedido: string
  codCliente: string
  cliente: string
  produto: string
  qtde: number
  preco: number
  total: number
}

export interface RcaMeta {
  id: string
  vendedor: string
  representada: string
}

export interface User {
  id: string
  nome: string
  role: 'vendor' | 'admin'
}

export interface UsersFile {
  vendorPasswordHash: string
  adminPasswordHash: string
  vendors: Array<{ id: string; nome: string }>
}

export type SessionPayload = {
  userId: string
  role: 'vendor' | 'admin'
}
