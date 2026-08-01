import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { formatarMoeda } from '../utils/formatters';
import './caixaPix.css';

export default function CaixaPix({ chavePix, nomeTitular, valor }) {
  const [copiado, setCopiado] = useState(false);

  if (!chavePix) return null;

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(chavePix);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    } catch {
      // fallback silencioso
    }
  };

  return (
    <div className="caixa-pix">
      <div className="caixa-pix-topo">
        <span className="caixa-pix-eyebrow">Pagamento via PIX</span>
        <span className="caixa-pix-titular">{nomeTitular}</span>
      </div>

      <div className="caixa-pix-corpo">
        <QRCodeSVG value={chavePix} size={104} bgColor="transparent" fgColor="#f7f0e4" />
        <div className="caixa-pix-chave-bloco">
          <code className="caixa-pix-chave">{chavePix}</code>
          <button type="button" className="btn btn-secundario" onClick={copiar}>
            {copiado ? 'Chave copiada ✓' : 'Copiar chave PIX'}
          </button>
        </div>
      </div>

      <p className="caixa-pix-instrucao">
        {valor
          ? <>Pague a entrada de <strong>{formatarMoeda(valor / 2)}</strong> (50% de {formatarMoeda(valor)}) agora pelo PIX acima e o restante na entrega.</>
          : 'Pague 50% de entrada agora pelo PIX acima e o restante na entrega.'} Envie o
        comprovante junto com a mensagem do pedido no WhatsApp.
      </p>
    </div>
  );
}
