#!/bin/bash

# Comentar window.location.href = '/login'
find /Users/ramon.rocha/Documents/projetoPessoal -type f \( -name "*.ts" -o -name "*.tsx" \) ! -path "*/node_modules/*" ! -path "*/.next/*" -exec sed -i '' 's/window\.location\.href = .\/login.;/\/\/ window.location.href = "\/login";/g' {} \;

# Comentar router.push('/login') quando usado para auth check
find /Users/ramon.rocha/Documents/projetoPessoal -type f \( -name "*.ts" -o -name "*.tsx" \) ! -path "*/node_modules/*" ! -path "*/.next/*" -exec sed -i '' 's/router\.push(.\/login.);/\/\/ router.push("\/login");/g' {} \;

echo "Redirecionamentos comentados!"
