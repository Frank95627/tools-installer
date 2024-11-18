#!/bin/bash

# Import env variables

source ./.dev/env/config.sh

# Installing Termux Dev!

echo -e "Installing Termux-Dev..."

# Creating Installation Directory

if [[ ! -d ~/.termux-dev ]]; then
  cp -r .dev/.termux-dev ~/.termux-dev
fi

# Path to Installation

echo "export TermuxDev='${show}'" >> ~/.termux-dev/env/config.sh
echo "export devPath='${show}/.dev'" >> ~/.termux-dev/env/config.sh

# Update termux repositories

yes|pkg update && yes|pkg upgrade

# Installing termux packages

yes|pkg install git gh zsh neovim nodejs python php curl wget lua-language-server lsd bat tur-repo proot ncurses-utils ripgrep stylua tmate cloudflared translate-shell html2text jq postgresql mariadb sqlite

# Installing termux-users repositories

yes|pkg install mongodb

# Installing package.json dependencies

npm install

# Installing npm modules (global)

npm install -g typescript @nestjs/cli prettier live-server localtunnel vercel vite

# Fixed localtunnel error in the file (openurl.js)

cp .dev/fix/localtunnel/openurl.js $PREFIX/lib/node_modules/localtunnel/node_modules/openurl/openurl.js

# Download NvChad (Neovim Setup)

rm -rf ~/.config/nvim
rm -rf ~/.local/state/nvim
rm -rf ~/.local/share/nvim

mkdir -p ~/.config

git clone https://github.com/NvChad/starter ~/.config/nvim

rm ~/.config/nvim/lua/plugins/init.lua
rm ~/.config/nvim/lua/configs/lspconfig.lua

wget https://raw.githubusercontent.com/TermuxDev/termux-dev-repo/main/install/nvchad/nvim/lua/plugins/init.lua -O ~/.config/nvim/lua/plugins/init.lua

wget https://raw.githubusercontent.com/TermuxDev/termux-dev-repo/main/install/nvchad/nvim/lua/configs/lspconfig.lua -O ~/.config/nvim/lua/configs/lspconfig.lua

# Download oh-my-zsh shell

sh -c "$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)" --unattended

# Creating zsh-plugins directory

if [[ ! -d ~/.zsh-plugins ]]; then
  mkdir -p ~/.zsh-plugins
fi

# Check zsh-plugins directory

if [[ -d ~/.zsh-plugins ]]; then

# Installing zsh powerlevel10k

  git clone --depth=1 https://github.com/romkatv/powerlevel10k.git ~/.zsh-plugins/powerlevel10k && echo 'source ~/.zsh-plugins/powerlevel10k/powerlevel10k.zsh-theme' >> ~/.zshrc

# Installing zsh-autosuggestions

  git clone https://github.com/zsh-users/zsh-autosuggestions.git ~/.zsh-plugins/zsh-autosuggestions && echo 'source ~/.zsh-plugins/zsh-autosuggestions/zsh-autosuggestions.zsh' >> ~/.zshrc

# Add alias to zshrc

  echo 'alias ls="lsd"' >> ~/.zshrc

fi

# Custom extra-keys and cursor

cp .dev/style/.termux/colors.properties ~/.termux
cp .dev/style/.termux/termux.properties ~/.termux

# Moving exec files to bin path

chmod +x .dev/bin/*
cp .dev/bin/* $PREFIX/bin

# Exec NvChad (neovim)

nvim

# Installation Finished

echo -e "Please Restart Termux App!"