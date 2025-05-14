# 💰 Passerelle de Monétisation d’API à la Demande

Mini-projet réalisé dans le cadre du cours **SoA et Microservices (A.U. 2024-2025)**  
👩‍💻 Étudiante en 4ᵉ année Informatique — Spécialité Data Science

---

## 🎯 Objectif

Ce projet met en œuvre une passerelle intelligente permettant la **monétisation d’appels d’API** à la demande.  
Il repose sur une architecture microservices combinant **4 styles d’architectures** modernes :

- **REST** : exposer les tarifs d'accès aux APIs
- **GraphQL** : requêtes personnalisables pour les utilisateurs
- **gRPC** : communication rapide entre services pour la facturation
- **Kafka** : journalisation et traçabilité des appels API

---

## 🧱 Architecture

Client (Postman / GraphiQL)
|
v
┌──────────────┐
│ API Gateway │ ← REST + GraphQL + Kafka (Producer) + gRPC (Client)
└──────────────┘
│ │ │
▼ ▼ ▼
REST gRPC Kafka
API Call Publish
│ │ │
▼ ▼ ▼
Pricing Billing Kafka Topic
Service Service "api-usage"
(gRPC) │
▼
Analytics Service
(Kafka Consumer)

---

## 📁 Structure du projet
api-monetization-gateway/
├── api-gateway/ # REST + GraphQL + gRPC client + Kafka producer
│ └── index.js
├── pricing-service/ # REST API des prix
│ └── index.js
├── billing-service/ # Service de facturation (gRPC)
│ ├── index.js
│ └── ../proto/billing.proto
├── analytics-service/ # Consommateur Kafka
│ └── index.js
├── proto/ # Fichier gRPC
│ └── billing.proto
├── docker-compose.yml # Kafka + Zookeeper

---

## 🚀 Lancer le projet

### 1. Démarrer Kafka et Zookeeper

```bash
docker-compose up -d

# Terminal 1 : Pricing Service (REST)
cd pricing-service
node index.js

# Terminal 2 : Billing Service (gRPC)
cd billing-service
node index.js

# Terminal 3 : Analytics Service (Kafka Consumer)
cd analytics-service
node index.js

# Terminal 4 : API Gateway (REST + GraphQL + Kafka)
cd api-gateway
node index.js

---

✅ Ce fichier est **entièrement prêt à l’emploi** :
- Colle-le dans `README.md`
- Remplace `[À remplacer par ton nom]` par ton vrai nom

Souhaites-tu maintenant que je te génère aussi :
- `.gitignore`
- `package.json` modèle
- un diagramme PNG de l’architecture à insérer dans GitHub ?

---

✅ Ce fichier est **entièrement prêt à l’emploi** :
- Colle-le dans `README.md`
- Remplace `[À remplacer par ton nom]` par ton vrai nom

Souhaites-tu maintenant que je te génère aussi :
- `.gitignore`
- `package.json` modèle
- un diagramme PNG de l’architecture à insérer dans GitHub ?





