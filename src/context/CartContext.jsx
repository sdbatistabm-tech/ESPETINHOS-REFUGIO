import { createContext, useContext, useMemo, useState, useEffect } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'refugio_carrinho';

export function CartProvider({ children }) {
  const [itens, setItens] = useState(() => {
    try {
      const salvo = sessionStorage.getItem(STORAGE_KEY);
      return salvo ? JSON.parse(salvo) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(itens));
  }, [itens]);

  const setQuantidade = (produto, quantidade) => {
    setItens((prev) => {
      const proximo = { ...prev };
      if (quantidade <= 0) {
        delete proximo[produto.id];
      } else {
        proximo[produto.id] = { produto, quantidade };
      }
      return proximo;
    });
  };

  const limparCarrinho = () => setItens({});

  const resumo = useMemo(() => {
    const lista = Object.values(itens);
    const totalUnidades = lista.reduce((soma, i) => soma + i.quantidade, 0);
    const totalProdutos = lista.reduce((soma, i) => soma + i.quantidade * i.produto.preco, 0);
    return { lista, totalUnidades, totalProdutos };
  }, [itens]);

  return (
    <CartContext.Provider value={{ itens, setQuantidade, limparCarrinho, ...resumo }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart precisa estar dentro de <CartProvider>');
  return ctx;
};
