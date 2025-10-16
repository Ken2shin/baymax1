import { getFirestore } from "../config/firebase.js"
import admin from "firebase-admin"

// Medical knowledge base for symptom analysis
const medicalKnowledge = {
  // Síntomas urgentes
  urgentSymptoms: [
    "dolor de pecho",
    "dificultad para respirar",
    "pérdida de conciencia",
    "sangrado severo",
    "convulsiones",
    "dolor abdominal intenso",
    "confusión mental",
    "parálisis",
    "visión borrosa repentina",
    "dolor de cabeza severo",
  ],

  // Base de conocimiento de síntomas y diagnósticos
  symptomDatabase: {
    fiebre: {
      diagnoses: ["Infección viral", "Gripe", "Infección bacteriana"],
      recommendations: [
        "Descansar",
        "Mantenerse hidratado",
        "Tomar paracetamol si es necesario",
        "Consultar médico si persiste más de 3 días",
      ],
    },
    tos: {
      diagnoses: ["Resfriado común", "Bronquitis", "Alergia"],
      recommendations: [
        "Beber líquidos calientes",
        "Usar humidificador",
        "Evitar irritantes",
        "Consultar si hay sangre o dura más de 2 semanas",
      ],
    },
    "dolor de cabeza": {
      diagnoses: ["Cefalea tensional", "Migraña", "Deshidratación"],
      recommendations: [
        "Descansar en lugar oscuro",
        "Aplicar compresas frías",
        "Mantenerse hidratado",
        "Evitar pantallas",
      ],
    },
    "dolor de garganta": {
      diagnoses: ["Faringitis viral", "Amigdalitis", "Resfriado"],
      recommendations: [
        "Hacer gárgaras con agua salada",
        "Beber líquidos tibios",
        "Descansar la voz",
        "Consultar si hay fiebre alta",
      ],
    },
    náuseas: {
      diagnoses: ["Gastroenteritis", "Intoxicación alimentaria", "Indigestión"],
      recommendations: ["Ayuno temporal", "Hidratación gradual", "Dieta blanda", "Consultar si hay deshidratación"],
    },
    "dolor abdominal": {
      diagnoses: ["Gastritis", "Indigestión", "Síndrome de intestino irritable"],
      recommendations: [
        "Dieta blanda",
        "Evitar alimentos irritantes",
        "Aplicar calor local",
        "Consultar si es intenso o persistente",
      ],
    },
    fatiga: {
      diagnoses: ["Falta de sueño", "Anemia", "Estrés"],
      recommendations: [
        "Mejorar higiene del sueño",
        "Alimentación balanceada",
        "Ejercicio moderado",
        "Consultar si es persistente",
      ],
    },
    mareos: {
      diagnoses: ["Vértigo", "Hipotensión", "Deshidratación"],
      recommendations: [
        "Sentarse o acostarse",
        "Hidratarse",
        "Evitar movimientos bruscos",
        "Consultar si es recurrente",
      ],
    },
  },
}

const analyzeSymptoms = (symptoms) => {
  const lowerSymptoms = symptoms.map((s) => s.toLowerCase())

  // Check for urgent symptoms
  const isUrgent = lowerSymptoms.some((symptom) =>
    medicalKnowledge.urgentSymptoms.some((urgent) => symptom.includes(urgent) || urgent.includes(symptom)),
  )

  // Collect diagnoses and recommendations
  const diagnoses = new Set()
  const recommendations = new Set()

  lowerSymptoms.forEach((symptom) => {
    Object.keys(medicalKnowledge.symptomDatabase).forEach((key) => {
      if (symptom.includes(key) || key.includes(symptom)) {
        const data = medicalKnowledge.symptomDatabase[key]
        data.diagnoses.forEach((d) => diagnoses.add(d))
        data.recommendations.forEach((r) => recommendations.add(r))
      }
    })
  })

  // Default responses if no match found
  if (diagnoses.size === 0) {
    diagnoses.add("Consulta médica recomendada para evaluación precisa")
  }

  if (recommendations.size === 0) {
    recommendations.add("Monitorear síntomas")
    recommendations.add("Consultar con un profesional de la salud")
    recommendations.add("Mantener registro de síntomas y su evolución")
  }

  // Add general recommendations
  recommendations.add("Esta es una orientación general, no reemplaza consulta médica")

  if (isUrgent) {
    recommendations.add("⚠️ URGENTE: Buscar atención médica inmediata")
  }

  return {
    suggestedDiagnosis: Array.from(diagnoses),
    recommendations: Array.from(recommendations),
    urgent: isUrgent,
  }
}

export const createConsult = async (userId, symptoms) => {
  const db = getFirestore()
  const consultRef = db.collection("medical_consults").doc()

  const analysis = analyzeSymptoms(symptoms)

  const newConsult = {
    userId,
    symptoms,
    suggestedDiagnosis: analysis.suggestedDiagnosis,
    recommendations: analysis.recommendations,
    urgent: analysis.urgent,
    consultDate: admin.firestore.FieldValue.serverTimestamp(),
  }

  await consultRef.set(newConsult)
  return { id: consultRef.id, ...newConsult }
}

export const getConsultsByUserId = async (userId) => {
  const db = getFirestore()
  const snapshot = await db
    .collection("medical_consults")
    .where("userId", "==", userId)
    .orderBy("consultDate", "desc")
    .get()

  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
}

export const deleteConsult = async (consultId) => {
  const db = getFirestore()
  await db.collection("medical_consults").doc(consultId).delete()
}
