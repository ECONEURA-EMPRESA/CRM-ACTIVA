# --- CONFIGURACIÓN DE TUS DATOS ---
$BillingAccountId = "017D82-3F0D3B-DC1B98"
$Timestamp = Get-Date -Format "yyMMddHHmm"
$ProjectId = "crm-activa-$Timestamp"
$ProjectName = "Metodo Activa CRM"
$Region = "europe-west1"

Write-Host "🚀 INICIANDO DESPLIEGUE AUTOMÁTICO DE INFRAESTRUCTURA GOOGLE CLOUD (PowerShell Edition)" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "Proyecto: $ProjectId"
Write-Host "Facturación: $BillingAccountId"
Write-Host "Región: $Region"
Write-Host ""

# 1. Crear el Proyecto
Write-Host "[1/9] Creando proyecto nuevo en Google Cloud..." -ForegroundColor Green
gcloud projects create $ProjectId --name="$ProjectName" --quiet
if ($LASTEXITCODE -ne 0) { Write-Error "Error creando proyecto"; exit 1 }

# 2. Configurar el entorno local
Write-Host "[2/9] Configurando entorno local..." -ForegroundColor Green
gcloud config set project $ProjectId

# 3. Vincular la Cuenta de Facturación
Write-Host "[3/9] Vinculando cuenta de facturación ($BillingAccountId)..." -ForegroundColor Green
gcloud beta billing projects link $ProjectId --billing-account=$BillingAccountId

# 4. Habilitar APIs
Write-Host "[4/9] Habilitando servicios (esto puede tardar unos minutos)..." -ForegroundColor Green
gcloud services enable run.googleapis.com firestore.googleapis.com storage.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com secretmanager.googleapis.com identitytoolkit.googleapis.com firebase.googleapis.com

# 5. Crear Firestore
Write-Host "[5/9] Creando base de datos Firestore en $Region..." -ForegroundColor Green
try {
    gcloud firestore databases create --location=$Region --type=firestore-native --quiet
}
catch {
    Write-Warning "La base de datos ya existe o hubo un aviso no crítico."
}

# 6. Crear Bucket Storage
Write-Host "[6/9] Creando almacén de archivos seguro (Bucket)..." -ForegroundColor Green
$BucketName = "gs://$ProjectId-secure-docs"
gsutil mb -l $Region -p $ProjectId $BucketName
gcloud storage buckets update $BucketName --public-access-prevention

# 7. Crear Artifact Registry
Write-Host "[7/9] Creando repositorio de imágenes..." -ForegroundColor Green
gcloud artifacts repositories create crm-repo --repository-format=docker --location=$Region --description="Repositorio para API Metodo Activa"

# 8. Generar configuración Terraform
Write-Host "[8/9] Generando configuración de Terraform (terraform.tfvars)..." -ForegroundColor Green
$TfVarsContent = @"
project_id = "$ProjectId"
region     = "$Region"
"@
Set-Content -Path "infra/terraform/terraform.tfvars" -Value $TfVarsContent

# 9. Generar configuración Frontend
Write-Host "[9/9] Obteniendo configuración de Firebase..." -ForegroundColor Green
$EnvContent = @"
VITE_FIREBASE_API_KEY="REEMPLAZAR_CON_API_KEY_DE_CONSOLA"
VITE_FIREBASE_AUTH_DOMAIN="$ProjectId.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="$ProjectId"
VITE_FIREBASE_STORAGE_BUCKET="$ProjectId-secure-docs"
VITE_FIREBASE_MESSAGING_SENDER_ID="REEMPLAZAR"
VITE_FIREBASE_APP_ID="REEMPLAZAR"
"@
Set-Content -Path "apps/crm-client/.env.local" -Value $EnvContent

Write-Host ""
Write-Host "✅ ¡INFRAESTRUCTURA LISTA!" -ForegroundColor Cyan
Write-Host "----------------------------------------------------------------"
Write-Host "Tu proyecto ID es: $ProjectId"
Write-Host "Todo está listo para desplegar el código del CRM."
