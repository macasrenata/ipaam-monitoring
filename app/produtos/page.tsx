'use client';

import { useEffect, useState } from 'react';
import { Container, Typography, CircularProgress, Box, Button } from '@mui/material';
import Filtro from '../components/Filtro';
import Tabela from '../components/Tabela';

interface Produto {
  nome_cientifico: string;
  volume_remanescente: number;
  ano: string;
  nome_razao_social_detentor: string;
}

const Home = () => {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [produtosFiltrados, setProdutosFiltrados] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarDados = async () => {
      const response = await fetch('/api/dados');
      const data = await response.json();
      setProdutos(data);
      setProdutosFiltrados(data); // Inicializa produtos filtrados com todos os dados
      setLoading(false);
    };
    carregarDados();
  }, []);

  interface Filtros {
    ano?: string;
    empresa?: string;
    especie?: string;
  }

  const handleFiltroChange = (filtros: Filtros) => {
    if (!filtros.ano && !filtros.empresa && !filtros.especie) {
      // Se os filtros estiverem vazios, reseta para o estado inicial
      setProdutosFiltrados(produtos);
      return;
    }

    const filtered = produtos.filter((produto) =>
      (!filtros.ano || produto.ano.includes(filtros.ano)) &&
      (!filtros.empresa || produto.nome_razao_social_detentor.includes(filtros.empresa)) &&
      (!filtros.especie || produto.nome_cientifico.includes(filtros.especie))
    );
    setProdutosFiltrados(filtered);
  };

  const gerarCSV = (dados: Produto[]) => {
    const headers = ['Ano', 'Empresa', 'Nome Científico', 'Volume Remanescente'];
    const rows = dados.map((produto) => [
      produto.ano,
      produto.nome_razao_social_detentor,
      produto.nome_cientifico,
      produto.volume_remanescente,
    ]);

    const csvContent = [
      headers.join(','), // Cabeçalhos
      ...rows.map((row) => row.join(',')), // Linhas
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'dados-ipaam.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Container
      maxWidth="md"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 4,
      }}
    >
      <Typography variant="h4" gutterBottom>
        Análise de Dados IPAAM
      </Typography>
      <br>
      </br>
      <br>
      </br>
      <Box
        component="img"
        src="/mapa.png"
        alt="Imagem Representativa"
        sx={{
          width: '100%',
          height: 'auto',
          maxWidth: '800px',
          marginTop: 2,
          marginBottom: 2,
        }}
      />
      <Filtro onFiltroChange={handleFiltroChange} />
      <Box sx={{ display: 'flex', gap: 2, marginBottom: 2, marginTop: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => gerarCSV(produtosFiltrados)}
        >
          Baixar Dados em CSV
        </Button>
      </Box>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Tabela produtos={produtosFiltrados} />
      )}
    </Container>
  );
};

export default Home;
