# Projeto-ARES-Mobile

Repositório da disciplina de Trabalho Interdisciplinar VI: Sistemas Paralelos e Distribuídos do sexto período do curso de Ciência da Computação da Pontifícia Universidade Católica de Minas Gerais - PUC Minas.

O projeto ARES Mobile (Aplicação de Reconhecimento e Ensino de Sinais) é uma aplicação móvel desenvolvida com React Native e Expo, que permite o reconhecimento de gestos da LIBRAS (Língua Brasileira de Sinais) através de uma interface intuitiva.

## 📋 Requisitos

Para desenvolver e executar o projeto ARES Mobile, você precisará:

- [ ] Node.js (versão LTS &ge; 14.x)
- [ ] npm (&ge; 6) ou yarn
- [ ] Expo CLI 

Você pode instalar os pacotes necessários com:

```bash
`npm install -g expo-cli`
#ou
`yarn global add expo-cli`
````

As dependências principais estão listadas no arquivo `package.json`. Entre as principais, destacam-se:

- [ ] `react-native`
- [ ] `expo`
- [ ] `@react-navigation/native`
- [ ] `@react-navigation/stack`
- [ ] `axios`

## 🖥️ Configuração do ambiente ativo:

#### Android

- ***Android Studio*** com Android SDK e um Android Virtual Device (AVD) configurado ou apenas o aplicativo ***Expo Go*** instalado no smartphone.

### iOS (macOS somente)

-  ***Xcode*** instalado (inclui Command Line Tools) ou apenas o aplicativo ***Expo Go*** instalado no smartphone.
-  Um ***simulador iOS*** configurado no Xcode.

## 🚀 Como rodar?

1) Clone o repositório:

```bash
git clone https://github.com/BlackStorm429/Projeto-ARES-Mobile.git
cd Projeto-ARES-Mobile
````

2) Instale as dependências:

```bash
npm install
# ou
yarn install
````

3) Inicie o servidor Metro:

```bash
expo start
#ou
npx expo start
````

4) Execute no emulador ou dispositivo físico:
    - ***Android***: pressione `a` no terminal para abrir o emulador configurado.
    - ***iOS (macOS)***: pressione `i` para abrir no simulador.
    - ***Dispositivo físico***: escaneie o QR code com o app Expo Go (Android/iOS).

## 📂Estrutura do Projeto  
  ```plaintext
  📂Projeto-ARES-Mobile/  
  ├── .expo/                     # Configurações do Expo (geradas automaticamente)
  ├── assets/                    # Imagens, fontes e outros recursos estéticos
  |   ├── 📂images/              # Imagens
  |   ├── 📂fonts/               # Fontes
  ├── src/                        # Código-fonte da aplicação
  │   ├── 📂components/          # Componentes reutilizáveis
  │   ├── 📂screens/             # Telas e rotas do app
  │   ├── 📂navigation/          # Configuração da navegação
  │   └── 📂services/            # Chamadas a APIs e funções auxiliares
  |   └── 📂styles/              # Arquivos de estilo
  ├── app.json                    # Configuração principal do Expo
  ├── package.json                # Dependências e scripts do projeto
  ├── tsconfig.json               # Configuração do TypeScript 
  ├── .gitignore                  # Arquivos e pastas ignorados pelo Git  
  ├── README.md                   # Documentação do projeto
  ````

## ⚙️ Scripts Úteis

Alguns scripts definidos no `package.json`:

- [ ] `npm run android` / `yarn android` &rarr; executa no emulador Android via React Native CLI.
- [ ] `npm run ios` / `yarn ios` &rarr; executa no simulador iOS via React Native CLI (macOS).
- [ ] `npm run web` / `yarn web` &rarr; executa como web app no navegador via Expo.

## 📝 Licença

Este projeto está licenciado sob a licença MIT. Consulte o arquivo LICENSE para mais informações.
