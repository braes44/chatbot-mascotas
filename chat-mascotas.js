const chatOutput = document.getElementById('chat-output');
const inputField = document.getElementById('entrada');
const sendButton = document.getElementById('enviar');

let conversationStep = 1; // Paso inicial para el flujo
let userPetInfo = {}; // Información sobre la mascota ingresada por el usuario
let chatLog = []; // Para almacenar todo el contenido del chat

// Base de datos de primeros auxilios para mascotas
const petFirstAidDatabase = {
  perros: {
    razas: {
      labrador: 'Evita alimentos como chocolate, uvas o pasas. En caso de intoxicación, induce el vómito si ha pasado menos de 1 hora y consulta al veterinario.',
      chihuahua: 'Cuidado con golpes en la cabeza debido a su fragilidad. Mantén azúcar a mano en caso de hipoglucemia.',
    },
    alimentos_prohibidos: ['chocolate', 'uvas', 'pasas', 'cebolla', 'ajo', 'alcohol'],
    medicamentos_prohibidos: ['ibuprofeno', 'paracetamol humano'],
  },
  gatos: {
    razas: {
      siames: 'Evita el contacto prolongado con químicos de limpieza. En caso de intoxicación, lava las patas y contacta al veterinario.',
      persa: 'Cuidado con infecciones respiratorias. Proporciónale un ambiente limpio y sin corrientes de aire.',
    },
    alimentos_prohibidos: ['chocolate', 'cebolla', 'ajo', 'leche'],
    medicamentos_prohibidos: ['paracetamol humano', 'aspirina'],
  },
};

// Saludo inicial
appendMessage('¡Hola! Soy tu asistente para primeros auxilios en mascotas. 🐶🐱 Por favor, dime la especie (perro o gato), la raza, y cualquier información adicional como medicamentos que quieras consultar.', 'bot');

// Evento de enviar mensaje
sendButton.addEventListener('click', async () => {
  const userMessage = inputField.value.trim();
  if (!userMessage) return;

  appendMessage(userMessage, 'user'); // Mostrar mensaje del usuario
  const botResponse = await getBotResponse(userMessage);
  appendMessage(botResponse, 'bot'); // Mostrar respuesta del bot
  inputField.value = ''; // Limpiar campo
});

// Función para mostrar mensajes
function appendMessage(message, sender) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${sender}`;
  messageDiv.textContent = message;
  chatOutput.appendChild(messageDiv);
  chatOutput.scrollTop = chatOutput.scrollHeight; // Scroll automático

  // Almacenar en el registro del chat
  chatLog.push(`${sender === 'bot' ? 'Bot' : 'Usuario'}: ${message}`);
}

// Función principal del chatbot
async function getBotResponse(userInput) {
  if (conversationStep === 1) {
    const [especie, raza, ...infoExtra] = userInput.toLowerCase().split(' ');

    if (!petFirstAidDatabase[especie]) {
      return 'Actualmente, solo puedo proporcionar información sobre perros y gatos.';
    }

    userPetInfo.especie = especie;
    userPetInfo.raza = raza;
    userPetInfo.infoExtra = infoExtra.join(' ');
    conversationStep = 2;

    return `Gracias. Mencionaste: ${especie} de raza ${raza}. ¿Qué necesitas saber? Opciones: "primeros auxilios", "alimentos prohibidos", "medicamentos prohibidos" o "buscar veterinarias".`;
  }

  if (conversationStep === 2) {
    const especie = userPetInfo.especie;
    const raza = userPetInfo.raza;

    if (/primeros auxilios/i.test(userInput)) {
      const razaInfo = petFirstAidDatabase[especie].razas[raza];
      return razaInfo
        ? `Primeros auxilios para ${raza}: ${razaInfo}`
        : 'No tengo información específica sobre esta raza, pero puedo ayudarte con información general sobre tu especie.';
    }

    if (/alimentos prohibidos/i.test(userInput)) {
      const alimentos = petFirstAidDatabase[especie].alimentos_prohibidos;
      return `Alimentos prohibidos para ${especie}s: ${alimentos.join(', ')}.`;
    }

    if (/medicamentos prohibidos/i.test(userInput)) {
      const medicamentos = petFirstAidDatabase[especie].medicamentos_prohibidos;
      return `Medicamentos prohibidos para ${especie}s: ${medicamentos.join(', ')}. Nunca mediques sin consultar a un veterinario.`;
    }

    if (/buscar veterinarias/i.test(userInput)) {
      return 'Puedes buscar veterinarias cercanas haciendo clic aquí: [Buscar Veterinarias en Google Maps](https://www.google.com/maps/search/veterinarias/).';
    }

    return 'No entendí tu solicitud. Intenta con: "primeros auxilios", "alimentos prohibidos", "medicamentos prohibidos" o "buscar veterinarias".';
  }

  return 'No estoy seguro de cómo ayudarte. Por favor, intenta ser más específico.';
}