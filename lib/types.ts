export interface PedidoItem {
  pedido:          string
  data:            string
  situacao:        string
  codCliente:      string
  cliente:         string
  clienteFantasia: string
  municipio:       string
  estado:          string
  produto:         string
  codigo:          string
  unidade:         string
  qtde:            number
  preco:           number
  desconto:        number
  total:           number
  tabelaPreco:     string
  planoPagto:      string
  observacoes:     string
  dataEntrega:     string
  ordemCompra:     string
  totalBruto:      number
  totalLiquido:    number
}

export interface RcaMeta {
  id:           string
  representada: string
  vendedor?:    string
}

export interface UsersFile {
  vendorPasswordHash: string
  adminPasswordHash:  string
  vendors: Array<{ id: string; nome: string }>
}

export type SessionPayload = {
  userId: string
  role:   'vendor' | 'admin'
}
