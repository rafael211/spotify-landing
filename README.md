# Wave - Plataforma de Música

Uma plataforma de streaming de música inspirada no Spotify, desenvolvida com tecnologias web modernas. O projeto "Wave" oferece uma experiência de música imersiva com interface elegante e funcionalidades avançadas.

## 🚀 Funcionalidades Atuais

- **Interface Inspirada no Spotify**: Design moderno com tema escuro, gradientes e layout responsivo
- **Sistema de Mock Data**: Dados simulados de músicas para demonstração
- **Controles de Reprodução**: Play/pause, barra de progresso, controles de volume (interface implementada)
- **Funcionalidade de Busca**: Pesquisa de músicas com resultados dinâmicos
- **Páginas Múltiplas**: Página inicial, busca e biblioteca
- **Imagens de Alta Qualidade**: Integração com Unsplash para capas de álbuns

## 🛠️ Tecnologias Utilizadas

- **HTML5**: Estrutura semântica das páginas
- **CSS3**: Estilização avançada com Flexbox, Grid e animações
- **JavaScript (ES6+)**: Lógica de aplicação e manipulação DOM
- **Web Audio API**: Preparado para síntese de áudio (não funcional atualmente)
- **Python HTTP Server**: Servidor local para desenvolvimento

## 📦 Instalação e Configuração

1. **Clone o repositório**:
   ```bash
   git clone https://github.com/rafael211/wave.git
   cd wave
   ```

2. **Inicie o servidor local**:
   ```bash
   python -m http.server 8000
   ```

3. **Abra no navegador**:
   Acesse `http://localhost:8000/HTML/index.html`

## 🎵 Como Usar

1. Navegue pela página inicial para ver as músicas em alta
2. Use a barra de busca para encontrar músicas específicas
3. Clique em uma música para interagir com os controles (reprodução ainda não funcional)

## ⚠️ Problemas Atuais

- **Reprodução de Música Não Funcional**: O sistema de geração procedural de música usando Web Audio API está implementado mas apresenta problemas técnicos, impedindo a reprodução de áudio
- **Integração com API Externa**: Tentativas de integração com SoundCloud API falharam devido a chave inválida
- **Funcionalidades Limitadas**: Muitas features estão na interface mas sem backend completo

## 🔮 Plano de Desenvolvimento Futuro

- **Correção da Reprodução de Música**: Resolver bugs na geração procedural para habilitar áudio funcional
- **Integração com API Real**: Implementar SoundCloud API ou outras APIs de música quando chaves válidas estiverem disponíveis
- **Sistema de Usuários**: Autenticação e perfis pessoais
- **Playlists Personalizadas**: Criação e gerenciamento de playlists
- **Modo Offline**: Cache de músicas para reprodução sem conexão
- **Integração com Redes Sociais**: Compartilhamento de músicas e playlists
- **Análise de Dados**: Estatísticas de reprodução e recomendações
- **Aplicativo Mobile**: Versão responsiva otimizada para dispositivos móveis

## 📁 Estrutura do Projeto

```
wave/
├── HTML/
│   ├── index.html          # Página inicial
│   ├── search.html         # Página de busca
│   └── library.html        # Biblioteca pessoal
├── scripts/
│   ├── music.js            # Lógica de música e player
│   └── animations.js       # Animações da interface
├── styles/
│   └── main.css            # Estilos principais
└── README.md               # Este arquivo
```

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fazer um fork do projeto
2. Criar uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abrir um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Contato

Para dúvidas ou sugestões, entre em contato através das issues do GitHub.

---

*Wave - Onde a música encontra a onda perfeita.*