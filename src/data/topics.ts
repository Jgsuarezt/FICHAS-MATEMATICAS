import { GradeDefinition, TopicDefinition } from "@/lib/types";

export const GRADES: GradeDefinition[] = [
  {
    slug: "infantil",
    name: "Educación Infantil",
    ageRange: "4 - 5 años",
    description:
      "Primeros pasos con los números, sumas sencillas de 1 cifra, series numéricas y comparación de cantidades.",
    seoTitle: "Fichas de Matemáticas para Infantil (4-5 años) en PDF Gratis",
    seoDescription:
      "Descarga fichas de matemáticas para Educación Infantil en PDF listas para imprimir: sumas fáciles, series numéricas y mayor o menor.",
    color: "from-amber-400 to-orange-500",
    recommendedTopics: ["sumas-sin-llevar", "restas-sin-llevar", "mayor-o-menor", "series-numericas"],
  },
  {
    slug: "1-primaria",
    name: "1.º de Primaria",
    ageRange: "6 - 7 años",
    description:
      "Sumas y restas sin llevar de 1 y 2 cifras, series numéricas, comparación de números y cálculo mental inicial.",
    seoTitle: "Fichas de Matemáticas 1.º de Primaria en PDF Gratis + Soluciones",
    seoDescription:
      "Genera e imprime fichas de matemáticas para 1.º de Primaria en PDF: sumas sin llevar, restas fáciles, series y comparación.",
    color: "from-emerald-400 to-teal-500",
    recommendedTopics: ["sumas-sin-llevar", "restas-sin-llevar", "series-numericas", "mayor-o-menor", "calculo-mental"],
  },
  {
    slug: "2-primaria",
    name: "2.º de Primaria",
    ageRange: "7 - 8 años",
    description:
      "Sumas y restas con llevadas, inicio a las tablas de multiplicar del 1 al 5 y cálculo mental.",
    seoTitle: "Fichas de Matemáticas 2.º de Primaria en PDF Gratis + Soluciones",
    seoDescription:
      "Fichas imprimibles de matemáticas para 2.º de Primaria con solucionario: sumas con llevadas, restas con llevadas y tablas de multiplicar.",
    color: "from-sky-400 to-blue-500",
    recommendedTopics: ["sumas-con-llevadas", "restas-con-llevadas", "tablas-de-multiplicar", "calculo-mental"],
  },
  {
    slug: "3-primaria",
    name: "3.º de Primaria",
    ageRange: "8 - 9 años",
    description:
      "Dominio de todas las tablas de multiplicar, multiplicaciones de 1 cifra, divisiones exactas y números romanos.",
    seoTitle: "Fichas de Matemáticas 3.º de Primaria en PDF Gratis + Soluciones",
    seoDescription:
      "Descarga fichas de matemáticas para 3.º de Primaria: tablas de multiplicar, multiplicaciones, divisiones de 1 cifra y números romanos.",
    color: "from-indigo-400 to-violet-500",
    recommendedTopics: ["tablas-de-multiplicar", "multiplicaciones", "divisiones-una-cifra", "numeros-romanos"],
  },
  {
    slug: "4-primaria",
    name: "4.º de Primaria",
    ageRange: "9 - 10 años",
    description:
      "Multiplicaciones de 2 cifras, divisiones con resto, iniciación a las fracciones y cálculo mental avanzado.",
    seoTitle: "Fichas de Matemáticas 4.º de Primaria en PDF Gratis + Soluciones",
    seoDescription:
      "Fichas de matemáticas para 4.º de Primaria listas para imprimir con respuestas: multiplicaciones de 2 cifras, divisiones y fracciones.",
    color: "from-purple-400 to-fuchsia-500",
    recommendedTopics: ["multiplicaciones", "divisiones-una-cifra", "divisiones-dos-cifras", "suma-de-fracciones", "numeros-romanos"],
  },
  {
    slug: "5-primaria",
    name: "5.º de Primaria",
    ageRange: "10 - 11 años",
    description:
      "Divisiones de 2 cifras, operaciones con fracciones, cálculo mental rápido y operaciones combinadas.",
    seoTitle: "Fichas de Matemáticas 5.º de Primaria en PDF Gratis + Soluciones",
    seoDescription:
      "Genera cuadernos y fichas de matemáticas para 5.º de Primaria en PDF: divisiones de 2 cifras, fracciones y cálculo mental.",
    color: "from-rose-400 to-pink-500",
    recommendedTopics: ["divisiones-dos-cifras", "suma-de-fracciones", "multiplicar-fracciones", "calculo-mental"],
  },
  {
    slug: "6-primaria",
    name: "6.º de Primaria",
    ageRange: "11 - 12 años",
    description:
      "Repaso integral de Primaria: operaciones con fracciones, divisiones complejas, números romanos y agilidad mental.",
    seoTitle: "Fichas de Matemáticas 6.º de Primaria en PDF Gratis + Soluciones",
    seoDescription:
      "Fichas de repaso de matemáticas para 6.º de Primaria en PDF con solucionario incluido.",
    color: "from-slate-600 to-slate-800",
    recommendedTopics: ["divisiones-dos-cifras", "suma-de-fracciones", "multiplicar-fracciones", "calculo-mental", "numeros-romanos"],
  },
];

export const TOPICS: TopicDefinition[] = [
  {
    slug: "sumas-sin-llevar",
    name: "Sumas sin llevar",
    shortName: "Sumas sin llevar",
    category: "Operaciones",
    grades: ["infantil", "1-primaria"],
    badge: "Básico",
    description:
      "Ejercicios progresivos de sumas sin llevadas de 1, 2 y 3 cifras en formato vertical u horizontal, ideales para iniciar en la adición.",
    seoTitle: "Fichas de Sumas sin Llevar en PDF Gratis para Imprimir",
    seoDescription:
      "Genera infinitas fichas de sumas sin llevar en PDF con solucionario. Configura 1, 2 o 3 cifras, tamaño de letra grande y descarga en 1 clic.",
    defaultConfig: {
      kind: "addition",
      difficulty: "facil",
      count: 20,
      layout: "vertical",
      carry: false,
      digitsA: 2,
      digitsB: 2,
      includeAnswers: true,
      fontSize: "normal",
    },
    supportsCarryToggle: true,
    supportsLayoutToggle: true,
    pedagogicalGuide: {
      intro:
        "Las sumas sin llevar son el primer paso fundamental para que los niños comprendan el valor posicional (unidades, decenas y centenas) sin la carga cognitiva de las llevadas.",
      howToTeach: [
        "Empieza siempre sumando la columna de la derecha (las unidades) y avanza hacia la izquierda.",
        "Utiliza material manipulativo como regletas, bloques o tapones si el niño aún está en 1.º de Primaria.",
        "Refuerza el hábito de alinear bien los números en columnas antes de empezar a calcular.",
      ],
      tips: [
        "Activa el formato 'Letra grande' para niños de 5 a 7 años.",
        "Comienza con 12 o 16 ejercicios por hoja para evitar la fatiga visual.",
      ],
      faqs: [
        {
          q: "¿A qué edad se aprenden las sumas sin llevar?",
          a: "Generalmente entre los 5 y los 7 años (final de Infantil y 1.º de Educación Primaria).",
        },
        {
          q: "¿Las fichas incluyen hoja de respuestas?",
          a: "Sí, puedes activar o desactivar la hoja de solucionario automático antes de descargar el PDF.",
        },
      ],
    },
  },
  {
    slug: "sumas-con-llevadas",
    name: "Sumas con llevadas",
    shortName: "Sumas con llevadas",
    category: "Operaciones",
    grades: ["2-primaria", "3-primaria"],
    badge: "Muy buscado",
    description:
      "Generador automático de sumas con llevadas de 2, 3 y 4 cifras. Cada ficha es única e incluye hoja de soluciones opcional.",
    seoTitle: "Fichas de Sumas con Llevadas en PDF Gratis + Solucionario",
    seoDescription:
      "Descarga e imprime fichas personalizadas de sumas con llevadas de 2, 3 y 4 cifras en PDF. Practica online o imprime con hoja de respuestas.",
    defaultConfig: {
      kind: "addition",
      difficulty: "medio",
      count: 20,
      layout: "vertical",
      carry: true,
      digitsA: 2,
      digitsB: 2,
      includeAnswers: true,
      fontSize: "normal",
    },
    supportsCarryToggle: true,
    supportsLayoutToggle: true,
    pedagogicalGuide: {
      intro:
        "Las sumas con llevadas aparecen cuando la suma de una columna es igual o superior a 10, obligando a agrupar una decena (o centena) y pasarla a la columna siguiente.",
      howToTeach: [
        "Explica el concepto de 'agrupar de 10 en 10' antes de enseñar la mecánica de apuntar el 1 arriba.",
        "Anima al alumno a escribir el número que se lleva en pequeño sobre la columna siguiente para no olvidarlo.",
        "Pasa de 2 cifras a 3 y 4 cifras de manera gradual una vez domine el mecanismo.",
      ],
      tips: [
        "Usa el Modo Interactivo en pantalla para que el niño compruebe al instante si ha olvidado sumar la llevada.",
      ],
      faqs: [
        {
          q: "¿Todas las sumas generadas tienen llevadas?",
          a: "Cuando activas 'Con llevadas', el generador garantiza que cada ejercicio requiera al menos una llevada real.",
        },
        {
          q: "¿Puedo generar un cuaderno completo de sumas?",
          a: "Sí, desde la sección de Cuadernos puedes generar un PDF de 5 o 10 páginas distintas en un solo clic.",
        },
      ],
    },
  },
  {
    slug: "restas-sin-llevar",
    name: "Restas sin llevar",
    shortName: "Restas sin llevar",
    category: "Operaciones",
    grades: ["infantil", "1-primaria"],
    badge: "Básico",
    description:
      "Fichas de restas sencillas sin llevadas, diseñadas para comprender la sustracción de forma clara y progresiva.",
    seoTitle: "Fichas de Restas sin Llevar en PDF Gratis para Niños",
    seoDescription:
      "Genera fichas de restas sin llevar en PDF listas para imprimir. Ejercicios de 1, 2 y 3 cifras con solucionario incluido.",
    defaultConfig: {
      kind: "subtraction",
      difficulty: "facil",
      count: 20,
      layout: "vertical",
      carry: false,
      digitsA: 2,
      digitsB: 2,
      includeAnswers: true,
      fontSize: "normal",
    },
    supportsCarryToggle: true,
    supportsLayoutToggle: true,
    pedagogicalGuide: {
      intro:
        "En las restas sin llevar, cada dígito del minuendo (arriba) es mayor o igual que el dígito correspondiente del sustraendo (abajo).",
      howToTeach: [
        "Refuerza la idea de 'quitar' o 'cuánto falta para llegar a' usando ejemplos cotidianos.",
        "Comprueba que el niño siempre coloque el número mayor arriba.",
      ],
      tips: [
        "Combina restas verticales con el formato horizontal para mejorar la agilidad mental.",
      ],
      faqs: [
        {
          q: "¿Pueden salir resultados negativos?",
          a: "No, todas las restas están validadas para Primaria con resultados positivos o cero.",
        },
      ],
    },
  },
  {
    slug: "restas-con-llevadas",
    name: "Restas con llevadas",
    shortName: "Restas con llevadas",
    category: "Operaciones",
    grades: ["2-primaria", "3-primaria"],
    badge: "Muy buscado",
    description:
      "Practica las restas llevando con ejercicios infinitos de 2, 3 y 4 cifras, listos para imprimir o resolver online.",
    seoTitle: "Fichas de Restas con Llevadas en PDF Gratis + Respuestas",
    seoDescription:
      "Descarga fichas de restas con llevadas en PDF gratis. Configura el número de cifras y obtén ejercicios únicos con hoja de soluciones.",
    defaultConfig: {
      kind: "subtraction",
      difficulty: "medio",
      count: 20,
      layout: "vertical",
      carry: true,
      digitsA: 3,
      digitsB: 2,
      includeAnswers: true,
      fontSize: "normal",
    },
    supportsCarryToggle: true,
    supportsLayoutToggle: true,
    pedagogicalGuide: {
      intro:
        "La resta con llevadas suele ser uno de los primeros retos importantes en 2.º y 3.º de Primaria. La práctica constante con fichas claras acelera su dominio.",
      howToTeach: [
        "Tanto el método de 'pedir prestado a la decena' como el de 'sumar 1 al sustraendo siguiente' son válidos; mantén el mismo método que usen en su colegio.",
        "Enseña a comprobar la resta sumando el resultado con el sustraendo.",
      ],
      tips: [
        "Empieza con 2 cifras y sube a 3 cifras cuando el alumno cometa menos de 2 errores por ficha.",
      ],
      faqs: [
        {
          q: "¿Cómo garantiza la web que las restas son con llevadas?",
          a: "Nuestro algoritmo verifica dígito a dígito que exista al menos una columna donde el minuendo sea menor que el sustraendo.",
        },
      ],
    },
  },
  {
    slug: "tablas-de-multiplicar",
    name: "Tablas de multiplicar",
    shortName: "Tablas de multiplicar",
    category: "Tablas y Cálculo",
    grades: ["2-primaria", "3-primaria"],
    badge: "Top 1",
    description:
      "Genera fichas de las tablas de multiplicar del 1 al 12, de una tabla concreta o todas mezcladas, en formato vertical u horizontal.",
    seoTitle: "Fichas de Tablas de Multiplicar (del 1 al 12) en PDF Gratis",
    seoDescription:
      "Crea fichas de las tablas de multiplicar del 1 al 12 o mezcladas en PDF gratis. Ideal para memorizar y repasar en Primaria.",
    defaultConfig: {
      kind: "multiplication",
      difficulty: "facil",
      count: 24,
      layout: "horizontal",
      carry: false,
      tableNumber: 0,
      digitsA: 1,
      digitsB: 1,
      includeAnswers: true,
      fontSize: "normal",
    },
    supportsTableSelector: true,
    supportsLayoutToggle: true,
    pedagogicalGuide: {
      intro:
        "Memorizar y comprender las tablas de multiplicar del 1 al 12 es la base indispensable para las multiplicaciones largas, las divisiones y las fracciones.",
      howToTeach: [
        "Empieza por las tablas más intuitivas: 1, 2, 5 y 10.",
        "Continúa con las tablas del 3, 4 y 9 (usando trucos como los dedos para la del 9).",
        "Deja las del 6, 7, 8, 11 y 12 para el final y repásalas mezcladas.",
      ],
      tips: [
        "Selecciona una tabla específica en el configurador para dominarla antes de pasar al modo 'Todas mezcladas'.",
      ],
      faqs: [
        {
          q: "¿Están disponibles todas las tablas del 1 al 12?",
          a: "Sí, a diferencia de otros sitios con tablas incompletas, aquí puedes generar fichas de cualquier tabla del 1 al 12 o combinadas al instante.",
        },
      ],
    },
  },
  {
    slug: "multiplicaciones",
    name: "Multiplicaciones de 1, 2 y 3 cifras",
    shortName: "Multiplicaciones",
    category: "Operaciones",
    grades: ["3-primaria", "4-primaria"],
    description:
      "Fichas de multiplicaciones en columna por 1, 2 o 3 cifras con espaciado amplio para realizar los productos parciales.",
    seoTitle: "Fichas de Multiplicaciones de 1, 2 y 3 Cifras en PDF Gratis",
    seoDescription:
      "Descarga fichas de multiplicaciones por 1, 2 y 3 cifras en PDF listas para imprimir con solucionario.",
    defaultConfig: {
      kind: "multiplication",
      difficulty: "medio",
      count: 16,
      layout: "vertical",
      carry: true,
      tableNumber: undefined,
      digitsA: 3,
      digitsB: 2,
      includeAnswers: true,
      fontSize: "normal",
    },
    pedagogicalGuide: {
      intro:
        "Una vez memorizadas las tablas, el siguiente paso es multiplicar números de varias cifras manteniendo el orden de las columnas y los productos parciales.",
      howToTeach: [
        "Recuerda dejar un hueco (o escribir un cero) a la derecha al multiplicar por las decenas.",
        "Mantén los números bien alineados para no equivocarse en la suma final.",
      ],
      tips: [
        "El PDF genera espacio suficiente debajo de cada multiplicación para que el niño pueda escribir todo el desarrollo.",
      ],
      faqs: [
        {
          q: "¿Puedo elegir cuántas cifras tiene cada factor?",
          a: "Sí, puedes configurar las cifras del multiplicando (hasta 4) y del multiplicador (1, 2 o 3 cifras).",
        },
      ],
    },
  },
  {
    slug: "divisiones-una-cifra",
    name: "Divisiones de una cifra",
    shortName: "Divisiones 1 cifra",
    category: "Operaciones",
    grades: ["3-primaria", "4-primaria"],
    description:
      "Fichas de divisiones entre una cifra (dividendo de 2, 3 o 4 cifras), con cociente y resto en la hoja de soluciones.",
    seoTitle: "Fichas de Divisiones de Una Cifra en PDF Gratis + Soluciones",
    seoDescription:
      "Genera fichas de divisiones de 1 cifra en PDF gratis para imprimir. Incluye cociente y resto en el solucionario.",
    defaultConfig: {
      kind: "division",
      difficulty: "facil",
      count: 16,
      layout: "vertical",
      carry: false,
      digitsA: 3,
      digitsB: 1,
      includeAnswers: true,
      fontSize: "normal",
    },
    pedagogicalGuide: {
      intro:
        "La división por una cifra consolida el uso inverso de las tablas de multiplicar y enseña el concepto de reparto y resto.",
      howToTeach: [
        "Empieza por dividendos de 2 cifras y divisores sencillos (2, 3, 4, 5).",
        "Practica la prueba de la división: Dividendo = Divisor × Cociente + Resto.",
      ],
      tips: [
        "En la hoja de soluciones te mostramos tanto el cociente como el resto (R).",
      ],
      faqs: [
        {
          q: "¿Incluye el resto en las respuestas?",
          a: "Sí, cuando la división no es exacta, el solucionario indica el cociente y el resto.",
        },
      ],
    },
  },
  {
    slug: "divisiones-dos-cifras",
    name: "Divisiones de dos cifras",
    shortName: "Divisiones 2 cifras",
    category: "Operaciones",
    grades: ["4-primaria", "5-primaria", "6-primaria"],
    description:
      "Ejercicios de divisiones con divisor de 2 cifras y dividendos de 3 o 4 cifras para 4.º, 5.º y 6.º de Primaria.",
    seoTitle: "Fichas de Divisiones de Dos Cifras en PDF Gratis + Solucionario",
    seoDescription:
      "Descarga fichas de divisiones de dos cifras en PDF con respuestas incluidas. Generador ilimitado para 4.º, 5.º y 6.º de Primaria.",
    defaultConfig: {
      kind: "division",
      difficulty: "dificil",
      count: 12,
      layout: "vertical",
      carry: false,
      digitsA: 4,
      digitsB: 2,
      includeAnswers: true,
      fontSize: "normal",
    },
    pedagogicalGuide: {
      intro:
        "Las divisiones de dos cifras requieren estimación, multiplicación mental y resta secuencial, siendo uno de los temas clave del último ciclo de Primaria.",
      howToTeach: [
        "Enseña a redondear el divisor a la decena más cercana para estimar la primera cifra del cociente.",
        "Verifica siempre que el resto parcial sea menor que el divisor.",
      ],
      tips: [
        "El formato de 12 divisiones por hoja deja amplio espacio en blanco para realizar las restas paso a paso.",
      ],
      faqs: [
        {
          q: "¿También se pueden hacer de 3 cifras?",
          a: "Sí, cambia el selector de cifras del divisor a 3 en el panel superior.",
        },
      ],
    },
  },
  {
    slug: "suma-de-fracciones",
    name: "Suma y resta de fracciones",
    shortName: "Suma/Resta Fracciones",
    category: "Fracciones",
    grades: ["4-primaria", "5-primaria", "6-primaria"],
    badge: "Nuevo",
    description:
      "Fichas de suma de fracciones con igual y distinto denominador, con resultado simplificado en el solucionario.",
    seoTitle: "Fichas de Suma y Resta de Fracciones en PDF Gratis",
    seoDescription:
      "Genera fichas de suma y resta de fracciones en PDF con solucionario simplificado. Ideal para 4.º, 5.º y 6.º de Primaria.",
    defaultConfig: {
      kind: "fractions",
      difficulty: "medio",
      count: 16,
      layout: "horizontal",
      carry: false,
      digitsA: 1,
      digitsB: 1,
      includeAnswers: true,
      fontSize: "normal",
    },
    pedagogicalGuide: {
      intro:
        "Operar con fracciones requiere entender el papel del numerador y el denominador, así como buscar fracciones equivalentes cuando los denominadores son distintos.",
      howToTeach: [
        "Nivel Fácil: mismo denominador (solo se suman los numeradores).",
        "Nivel Medio y Difícil: distinto denominador (calculando el mínimo común múltiplo).",
      ],
      tips: [
        "Las soluciones muestran la fracción irreducible para reforzar la simplificación.",
      ],
      faqs: [
        {
          q: "¿Puedo elegir fracciones con el mismo denominador?",
          a: "Sí, selecciona la dificultad 'Fácil' para trabajar exclusivamente con igual denominador.",
        },
      ],
    },
  },
  {
    slug: "multiplicar-fracciones",
    name: "Multiplicación de fracciones",
    shortName: "Multiplicar Fracciones",
    category: "Fracciones",
    grades: ["5-primaria", "6-primaria"],
    description:
      "Ejercicios de multiplicación de fracciones con resultados irreducibles listos para imprimir o practicar en pantalla.",
    seoTitle: "Fichas de Multiplicar Fracciones en PDF Gratis + Respuestas",
    seoDescription:
      "Descarga fichas de multiplicación de fracciones en PDF gratis con solucionario simplificado.",
    defaultConfig: {
      kind: "fractions",
      difficulty: "dificil",
      count: 16,
      layout: "horizontal",
      carry: true,
      digitsA: 1,
      digitsB: 1,
      includeAnswers: true,
      fontSize: "normal",
    },
    pedagogicalGuide: {
      intro:
        "Multiplicar fracciones es más directo que sumarlas: se multiplican los numeradores entre sí y los denominadores entre sí.",
      howToTeach: [
        "Recuerda simplificar el resultado final dividiendo numerador y denominador por su máximo común divisor.",
      ],
      tips: [
        "Practica primero con fracciones de denominadores pequeños (nivel Fácil o Medio).",
      ],
      faqs: [
        {
          q: "¿El solucionario simplifica la fracción resultante?",
          a: "Sí, todas las respuestas se expresan como fracción irreducible (o número entero si es exacta).",
        },
      ],
    },
  },
  {
    slug: "mayor-o-menor",
    name: "Mayor que, menor que e igual (< > =)",
    shortName: "Mayor / Menor",
    category: "Numeración",
    grades: ["infantil", "1-primaria", "2-primaria"],
    description:
      "Fichas para aprender a comparar números usando los signos >, < e = desde 1 hasta 4 cifras.",
    seoTitle: "Fichas de Mayor que y Menor que (< > =) en PDF Gratis",
    seoDescription:
      "Genera fichas de comparación de números (mayor que, menor que, igual) en PDF para Infantil y Primaria.",
    defaultConfig: {
      kind: "comparison",
      difficulty: "facil",
      count: 24,
      layout: "horizontal",
      carry: false,
      digitsA: 2,
      digitsB: 2,
      includeAnswers: true,
      fontSize: "grande",
    },
    pedagogicalGuide: {
      intro:
        "Comparar cantidades desarrolla el sentido numérico y prepara al alumno para ordenar números y entender el valor posicional.",
      howToTeach: [
        "Usa el truco clásico del 'cocodrilo hambriento': la boca abierta siempre se come al número más grande.",
        "Cuando tienen el mismo número de cifras, enseña a comparar primero la cifra de la izquierda.",
      ],
      tips: [
        "Selecciona 1 cifra para Infantil y 2 o 3 cifras para 1.º y 2.º de Primaria.",
      ],
      faqs: [
        {
          q: "¿Aparecen también casos donde los números son iguales?",
          a: "Sí, aproximadamente un 15 % de los ejercicios corresponden al signo '=' para evitar que respondan por inercia.",
        },
      ],
    },
  },
  {
    slug: "series-numericas",
    name: "Series numéricas",
    shortName: "Series numéricas",
    category: "Numeración",
    grades: ["infantil", "1-primaria", "2-primaria"],
    description:
      "Completa las secuencias numéricas ascendentes y descendentes de 1 en 1, 2 en 2, 5 en 5 o 10 en 10.",
    seoTitle: "Fichas de Series Numéricas en PDF Gratis para Niños",
    seoDescription:
      "Descarga fichas de series numéricas y secuencias lógicas en PDF gratis para Infantil y Primaria.",
    defaultConfig: {
      kind: "sequence",
      difficulty: "facil",
      count: 12,
      layout: "horizontal",
      carry: false,
      digitsA: 2,
      digitsB: 1,
      includeAnswers: true,
      fontSize: "normal",
    },
    pedagogicalGuide: {
      intro:
        "Las series numéricas fortalecen el conteo, la detección de patrones y son la antesala del cálculo mental y las tablas de multiplicar.",
      howToTeach: [
        "Pide al alumno que identifique cuánto suma o resta entre dos números consecutivos antes de rellenar los huecos.",
      ],
      tips: [
        "Sube a dificultad Media o Difícil para introducir saltos mayores y series descendentes.",
      ],
      faqs: [
        {
          q: "¿Qué tipo de series se generan?",
          a: "Series ascendentes y descendentes con paso constante adaptado a la dificultad elegida.",
        },
      ],
    },
  },
  {
    slug: "numeros-romanos",
    name: "Números romanos",
    shortName: "Números romanos",
    category: "Numeración",
    grades: ["3-primaria", "4-primaria", "6-primaria"],
    description:
      "Ejercicios para convertir números arábigos a números romanos y viceversa, con reglas de suma y resta.",
    seoTitle: "Fichas de Números Romanos en PDF Gratis + Solucionario",
    seoDescription:
      "Genera fichas de números romanos en PDF para imprimir con respuestas incluidas. Ideal para 3.º y 4.º de Primaria.",
    defaultConfig: {
      kind: "roman",
      difficulty: "medio",
      count: 20,
      layout: "horizontal",
      carry: false,
      digitsA: 3,
      digitsB: 1,
      includeAnswers: true,
      fontSize: "normal",
    },
    pedagogicalGuide: {
      intro:
        "El sistema de numeración romano sigue presente en relojes, siglos, capítulos y monumentos. Aprender sus siete letras (I, V, X, L, C, D, M) es parte del currículo de Primaria.",
      howToTeach: [
        "Recuerda que las letras I, X, C y M pueden repetirse hasta 3 veces seguidas, pero V, L y D no se repiten.",
        "Si una letra menor va a la izquierda de una mayor, se resta (IV = 4, IX = 9, XL = 40).",
      ],
      tips: [
        "En nivel Fácil se trabajan números hasta el 50; en Medio hasta el 500 y en Difícil hasta el 3999.",
      ],
      faqs: [
        {
          q: "¿Cómo funcionan las respuestas?",
          a: "Cada ficha combina conversiones de número normal a romano y de romano a normal.",
        },
      ],
    },
  },
  {
    slug: "calculo-mental",
    name: "Cálculo mental rápido",
    shortName: "Cálculo mental",
    category: "Tablas y Cálculo",
    grades: ["1-primaria", "2-primaria", "3-primaria", "4-primaria", "5-primaria", "6-primaria"],
    badge: "Entrenamiento",
    description:
      "Batería de operaciones rápidas combinadas (sumas, restas y multiplicaciones) para mejorar la agilidad y velocidad matemática.",
    seoTitle: "Fichas de Cálculo Mental en PDF Gratis para Primaria",
    seoDescription:
      "Entrena la agilidad matemática con fichas de cálculo mental rápido en PDF o en modo interactivo con autocorrección.",
    defaultConfig: {
      kind: "mental",
      difficulty: "medio",
      count: 24,
      layout: "horizontal",
      carry: false,
      digitsA: 2,
      digitsB: 1,
      includeAnswers: true,
      fontSize: "normal",
    },
    pedagogicalGuide: {
      intro:
        "Dedicar 5 minutos al día al cálculo mental mejora la concentración, la memoria de trabajo y la confianza ante problemas matemáticos complejos.",
      howToTeach: [
        "Fomenta estrategias como redondear a la decena (ej. 28 + 9 = 28 + 10 - 1) o descomponer números.",
        "Usa el Modo Interactivo para cronometrar cuánto tarda en completar una ficha de 24 operaciones.",
      ],
      tips: [
        "Ajusta la dificultad según el curso: Fácil (hasta 20), Medio (hasta 100), Difícil (operaciones variadas mayores).",
      ],
      faqs: [
        {
          q: "¿Qué operaciones incluye?",
          a: "Combina sumas, restas y multiplicaciones adaptadas a la dificultad seleccionada.",
        },
      ],
    },
  },
  {
    slug: "anterior-y-posterior",
    name: "Número anterior y posterior",
    shortName: "Anterior y posterior",
    category: "Numeración",
    grades: ["infantil", "1-primaria", "2-primaria"],
    badge: "Nuevo",
    description:
      "Fichas para practicar qué número va antes y después de un número dado, ideal para afianzar la recta numérica.",
    seoTitle: "Fichas de Número Anterior y Posterior en PDF Gratis",
    seoDescription:
      "Descarga fichas de anterior y posterior en PDF gratis para Infantil y 1.º de Primaria. Ejercicios hasta el 1000 con solucionario.",
    defaultConfig: {
      kind: "neighbors",
      difficulty: "facil",
      count: 20,
      layout: "horizontal",
      carry: false,
      digitsA: 2,
      digitsB: 1,
      includeAnswers: true,
      fontSize: "grande",
    },
    pedagogicalGuide: {
      intro:
        "Identificar el número anterior (-1) y posterior (+1) es clave en Infantil y primeros cursos de Primaria para comprender el orden de la serie numérica.",
      howToTeach: [
        "Empieza con números del 1 al 30 usando una recta numérica dibujada.",
        "Presta especial atención a los cambios de decena (ej. anterior a 20 o posterior a 39).",
      ],
      tips: [
        "El nivel Fácil llega hasta el 30, Medio hasta el 200 y Difícil hasta el 999.",
      ],
      faqs: [
        {
          q: "¿Cómo se escriben las respuestas en el modo interactivo?",
          a: "Escribe el número anterior y el posterior separados por una coma (ej. 14, 16).",
        },
      ],
    },
  },
  {
    slug: "unidades-decenas-centenas",
    name: "Unidades, decenas y centenas",
    shortName: "Unidades, Decenas y Centenas",
    category: "Numeración",
    grades: ["1-primaria", "2-primaria", "3-primaria"],
    badge: "Nuevo",
    description:
      "Descomposición numérica en unidades (U), decenas (D) y centenas (C) para dominar el valor posicional.",
    seoTitle: "Fichas de Unidades, Decenas y Centenas en PDF Gratis",
    seoDescription:
      "Genera fichas de descomposición de números en unidades, decenas y centenas en PDF con respuestas.",
    defaultConfig: {
      kind: "placeValue",
      difficulty: "medio",
      count: 16,
      layout: "horizontal",
      carry: false,
      digitsA: 3,
      digitsB: 1,
      includeAnswers: true,
      fontSize: "normal",
    },
    pedagogicalGuide: {
      intro:
        "Comprender que el dígito 3 en 345 vale 300 (3 centenas) es la base de las sumas y restas con llevadas.",
      howToTeach: [
        "Asocia las unidades a 1, las decenas a grupos de 10 y las centenas a grupos de 100.",
      ],
      tips: [
        "Usa el nivel Fácil para trabajar solo decenas y unidades (números de 2 cifras).",
      ],
      faqs: [
        {
          q: "¿Incluye ejercicios inversos?",
          a: "Sí, en nivel Difícil también se pide formar el número a partir de sus C, D y U.",
        },
      ],
    },
  },
  {
    slug: "numeros-decimales",
    name: "Sumas y restas con decimales",
    shortName: "Números decimales",
    category: "Fracciones",
    grades: ["4-primaria", "5-primaria", "6-primaria"],
    badge: "Nuevo",
    description:
      "Ejercicios de sumas y restas con números decimales (décimas y centésimas) con solucionario incluido.",
    seoTitle: "Fichas de Sumas y Restas con Decimales en PDF Gratis",
    seoDescription:
      "Descarga fichas de números decimales en PDF para 4.º, 5.º y 6.º de Primaria. Sumas y restas con décimas y centésimas.",
    defaultConfig: {
      kind: "decimals",
      difficulty: "medio",
      count: 20,
      layout: "horizontal",
      carry: false,
      digitsA: 2,
      digitsB: 2,
      includeAnswers: true,
      fontSize: "normal",
    },
    pedagogicalGuide: {
      intro:
        "Operar con números decimales requiere alinear correctamente las comas decimales antes de sumar o restar como con números naturales.",
      howToTeach: [
        "Recuerda al alumno que la coma decimal siempre debe quedar en la misma columna.",
        "Si un número tiene menos decimales, se puede completar con ceros a la derecha.",
      ],
      tips: [
        "Activa la cuadrícula de 5 mm si quieres que alineen la coma en columna debajo de cada ejercicio.",
      ],
      faqs: [
        {
          q: "¿Cuántos decimales tienen los ejercicios?",
          a: "En nivel Fácil tienen 1 decimal (décimas) y en Medio/Difícil 2 decimales (centésimas).",
        },
      ],
    },
  },
  {
    slug: "regla-de-tres",
    name: "Regla de tres simple",
    shortName: "Regla de tres",
    category: "Tablas y Cálculo",
    grades: ["5-primaria", "6-primaria"],
    badge: "Nuevo",
    description:
      "Practica la proporcionalidad directa mediante ejercicios de regla de tres simple con resultados exactos.",
    seoTitle: "Fichas de Regla de Tres Simple en PDF Gratis + Soluciones",
    seoDescription:
      "Genera fichas de regla de tres simple directa en PDF gratis para 5.º y 6.º de Primaria con solucionario.",
    defaultConfig: {
      kind: "ruleOfThree",
      difficulty: "medio",
      count: 16,
      layout: "horizontal",
      carry: false,
      digitsA: 2,
      digitsB: 2,
      includeAnswers: true,
      fontSize: "normal",
    },
    pedagogicalGuide: {
      intro:
        "La regla de tres simple directa permite hallar un cuarto valor desconocido a partir de tres valores proporcionales conocidos.",
      howToTeach: [
        "Enseña primero el método de reducción a la unidad: cuánto vale 1 unidad y luego multiplicar.",
        "Comprueba la relación multiplicando en cruz y dividiendo.",
      ],
      tips: [
        "Todas las fichas generan resultados enteros exactos para evitar confusiones iniciales.",
      ],
      faqs: [
        {
          q: "¿Todos los ejercicios son de proporcionalidad directa?",
          a: "Sí, están pensados para iniciar y consolidar la regla de tres directa en Primaria.",
        },
      ],
    },
  },
  {
    slug: "mcm-y-mcd",
    name: "MCM y MCD (Mínimo Común Múltiplo y Máximo Común Divisor)",
    shortName: "MCM y MCD",
    category: "Numeración",
    grades: ["5-primaria", "6-primaria"],
    badge: "Nuevo",
    description:
      "Ejercicios para calcular el Mínimo Común Múltiplo (MCM) y el Máximo Común Divisor (MCD) de pares de números.",
    seoTitle: "Fichas de MCM y MCD en PDF Gratis + Solucionario",
    seoDescription:
      "Descarga fichas de Mínimo Común Múltiplo (MCM) y Máximo Común Divisor (MCD) en PDF gratis para 5.º y 6.º de Primaria.",
    defaultConfig: {
      kind: "mcmMcd",
      difficulty: "medio",
      count: 16,
      layout: "horizontal",
      carry: false,
      digitsA: 2,
      digitsB: 2,
      includeAnswers: true,
      fontSize: "normal",
    },
    pedagogicalGuide: {
      intro:
        "El MCM y el MCD son fundamentales para sumar fracciones de distinto denominador y para simplificar fracciones.",
      howToTeach: [
        "Para el MCM: descompón en factores primos y multiplica factores comunes y no comunes al mayor exponente.",
        "Para el MCD: multiplica solo los factores comunes al menor exponente.",
      ],
      tips: [
        "Activa la cuadrícula de 5 mm para que el alumno haga la descomposición factorial debajo de cada ejercicio.",
      ],
      faqs: [
        {
          q: "¿La ficha mezcla MCM y MCD?",
          a: "Sí, cada ejercicio indica claramente si debe calcularse el MCM o el MCD.",
        },
      ],
    },
  },
  {
    slug: "operaciones-combinadas",
    name: "Operaciones combinadas con paréntesis",
    shortName: "Operaciones combinadas",
    category: "Tablas y Cálculo",
    grades: ["4-primaria", "5-primaria", "6-primaria"],
    badge: "Nuevo",
    description:
      "Practica la jerarquía de operaciones (paréntesis, multiplicaciones, sumas y restas) con solucionario.",
    seoTitle: "Fichas de Operaciones Combinadas en PDF Gratis + Respuestas",
    seoDescription:
      "Genera fichas de operaciones combinadas con paréntesis para Primaria en PDF gratis con solucionario.",
    defaultConfig: {
      kind: "combined",
      difficulty: "medio",
      count: 16,
      layout: "horizontal",
      carry: false,
      digitsA: 2,
      digitsB: 1,
      includeAnswers: true,
      fontSize: "normal",
    },
    pedagogicalGuide: {
      intro:
        "Las operaciones combinadas enseñan la jerarquía matemática: primero paréntesis, luego multiplicaciones y divisiones, y por último sumas y restas.",
      howToTeach: [
        "Subraya en cada paso la operación que toca resolver primero.",
        "Empieza por el nivel Fácil (sin paréntesis) antes de pasar a Medio y Difícil.",
      ],
      tips: [
        "Activa la cuadrícula para que puedan escribir los pasos intermedios ordenadamente debajo.",
      ],
      faqs: [
        {
          q: "¿Qué incluye cada nivel?",
          a: "Fácil: sumas y multiplicaciones; Medio: paréntesis y multiplicación; Difícil: paréntesis, multiplicación y resta.",
        },
      ],
    },
  },
];

export function getTopicBySlug(slug: string): TopicDefinition | undefined {
  return TOPICS.find((t) => t.slug === slug);
}

export function getGradeBySlug(slug: string): GradeDefinition | undefined {
  return GRADES.find((g) => g.slug === slug);
}
