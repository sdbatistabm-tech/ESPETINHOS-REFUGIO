const CLASSES = {
  'Novo': 'badge-novo',
  'Em preparo': 'badge-em-preparo',
  'Pronto': 'badge-pronto',
  'Entregue': 'badge-entregue',
  'Cancelado': 'badge-cancelado',
  'Pago': 'badge-pago',
};

export default function StatusBadge({ status }) {
  return <span className={`badge ${CLASSES[status] || 'badge-novo'}`}>{status}</span>;
}
