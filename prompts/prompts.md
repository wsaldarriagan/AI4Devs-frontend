# Desarrollo de tablero Kanban para la gestión de procesos de selección.

## 1. Generacion del fronto en GPT Engeneer - Lovable
Se gener con el prompt y las siguientes interacciones el codigo para el front del tablero kanban en GPT Engeneer, ahora lovable.

```
    You are an expert frontend developer. I have an ATS for HR departments. I need a kanban-styled pipeline for candidates like the one in the picture, including menus, header, etc. I need it to be responsive.

```

```
    The cards do not support drag-and-drop functionality for transitioning between states.
```

## 2. Integracion del front con el proyecto

### 2.1. Contexto general del proyecto
```
    analiza el proyecto y hazme un resumen de tecnologias, componentes, buenas practicas de desarrollo implementadas en este, además de las dependencias y forma de inicializar el proyecto
```

### 2.2. Integracion del front con el proyecto
```
    ahora que conoces la estructura del proyecto quiero que me ayudes con lo siguiente, se requiere desarrollar el siguiente requerimiento para el frontend.

    ## Requerimiento: Creación del Componente Básico kanbanBoardPosition

    ### Objetivo:
    Desarrollar un componente básico llamado `kanbanBoardPosition` que inicialmente mostrará solo el título de la posición. Este componente se integrará con la funcionalidad existente de "positions", activándose a través del botón "Ver proceso".

    ### Detalles del Requerimiento:

    1. **Componente kanbanBoardPosition:**
    - **Creación del Componente:** Desarrollar un nuevo componente React denominado `kanbanBoardPosition`.
    - **Ubicación del Componente:** El componente debe estar ubicado dentro de la carpeta `src/components` para mantener la estructura del proyecto.
    - **Contenido Inicial del Componente:** El componente inicialmente deberá incluir solo el título de la posición, el cual se recuperará de la API o se pasará como prop al componente.

    2. **Integración con el Componente de Posiciones:**
    - **Modificación del Botón "Ver proceso":** Ajustar el botón en cada tarjeta de posición para que redirija al componente `kanbanBoardPosition`.
    - **Enrutamiento:** Asegurar que el botón "Ver proceso" use React Router para navegar a la nueva ruta del `kanbanBoardPosition`. La ruta debe incluir un parámetro que identifique la posición específica (por ejemplo, `/kanbanPosition/:positionId`).

    3. **Estructura de la URL:**
    - **Parámetros de la Ruta:** Configurar la ruta para que acepte el ID de la posición como parámetro. Esto permitirá que el componente `kanbanBoardPosition` recupere y muestre el título correcto de la posición.

    4. **Buenas Prácticas y Estandarización:**
    - **Cumplimiento de Estándares:** El componente debe seguir los lineamientos de codificación y diseño del proyecto, incluyendo estilos, nomenclaturas y prácticas de desarrollo.
    - **Accesibilidad y Responsividad:** Diseñar el título y cualquier otro elemento del componente para que sean accesibles y visualmente coherentes en diferentes dispositivos.
```

```
    ahora quiero implementar la funcionalidad en el componente @kanbanBoardPosition.tsx , te suministrare codigo generado en otra herrmienta de maquetación de frontend, asi que revisa bien el codigo antes de implementar para que conservemos las buenas practicas del proyecto
```

```
    Esta es la primera secuencia de codigo propuesta por la herramienta de maquetación de frontend.

    import { Card } from "@/components/ui/card";
    import { CandidateCard } from "./CandidateCard";
    import { Droppable } from "@hello-pangea/dnd";

    interface KanbanColumnProps {
    id: string;
    title: string;
    count: number;
    color: string;
    candidates: Array<{
        id: string;
        name: string;
        email: string;
        avatar: string;
        score: number;
    }>;
    }

    export function KanbanColumn({ id, title, count, color, candidates }: KanbanColumnProps) {
    return (
        <div className="flex flex-col min-w-[300px] gap-4">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
            <h3 className="font-semibold">{title}</h3>
            <span
                className="px-2 py-1 text-xs rounded-full"
                style={{ backgroundColor: `${color}20`, color: color }}
            >
                {count}
            </span>
            </div>
        </div>
        <Droppable droppableId={id}>
            {(provided) => (
            <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="space-y-4"
            >
                {candidates.map((candidate, index) => (
                <CandidateCard key={candidate.id} index={index} {...candidate} />
                ))}
                {provided.placeholder}
            </div>
            )}
        </Droppable>
        </div>
    );
    }
```	

```
    requiero validar las funcionalidades nuevas del front, ayudame a validar que si esten bien implementadas, te las ire pasando una a una para garantizar que su funcionalidad base este bien implementada y si ves que requerimos implementar alguna me cuentas.

    export default function Index() {
    const [candidates, setCandidates] = useState(initialCandidates);

    const onDragEnd = (result: DropResult) => {
        const { source, destination } = result;

        // Dropped outside the list
        if (!destination) return;

        // Same list, same position
        if (
        source.droppableId === destination.droppableId &&
        source.index === destination.index
        ) {
        return;
        }

        const sourceList = candidates[source.droppableId as keyof typeof candidates];
        const destList = candidates[destination.droppableId as keyof typeof candidates];
        const [removed] = sourceList.splice(source.index, 1);
        destList.splice(destination.index, 0, removed);

        setCandidates({ ...candidates });
    };
```

### 2.3. Mejora experiencia de usuario
```
   Quiero mejorar la experiencia de usuario con ese tablero kanban, la verdad es que esta dificil de operar, adem+as su interfaz grafica aun es mejorable, que me propones?
```

```
    sabes... se hace muy dificil hacer el drag and drop, porque no es facil seleccionar la tarjeta del candidato para pasarla a otra columna, es como si se quedara pegado el objeto
```

```
    con el cambio quedo peor, ya es que ni se pueden mover las tarjetas de candidatos
```	

```
    ahora quiero que el tablero se vea visualmente mas tractivo y moderno, esta muy plano
```

```
    ahora quiero que se vea centrado en la pantalla y que te asegures que sea responsive
```
```
    ahora volvamos a la lectura y actualizacion de las posiciones de los candidatos, cada que refresco el navegador se pierde la información, indagando me di cuenta que el mock es un array en el @seed.ts, como hago para que eso definitivamente se guarde y los datos sean coherentes y consistentes?
```

```
    requiero que antes de proponerme cosas raras y ponerme a dar vueltas revises el proyecto completo y me des alternativas ya validadas, es claro?
```

### 2.4. Consumo de API
```
    El endpopint GET /positions/:id/candidates, devuelve todos los candidatos en proceso para una determinada posición, es decir, todas las aplicaciones para un determinado positionID. Proporciona la siguiente información:

    * name: Nombre completo del candidato
    * current_interview_step: en qué fase del proceso está el candidato.
    score: La puntuación media del candidato

    Quiero que los datos que se muestran en el kanban, sea de los candidatos recuperados por el endpoint corrento, este es para eso, verdad? Si me vas a sugerir cambios asegurate que me indiques el archivo donde se debe hacer el cambio
```
```
    Quiero que revises con detenimiento el proyecto, en especial el front para que garanticesmos que en @kanbanBoardPosition.tsx usemos el endpoint PUT /candidates/:id/stage, para que cada que se cambie un candidato de etapa en el proceso (drag and drop), se consuma el endpoint y se actualice la nueva posicion del candidato, es claro?
```	

### 2.5. Refactorización del codigo
```
    el archivo @KanbanBoardPosition.css sigue los patrones del proyecto?
    se usan los siguientes conceptos en ese archivo @kanbanBoardPosition.tsx :
    DDD, solid y patrones de diseño como Singleton, Factory, Observer o Strategy?
```
```
    lo que quiero es que me ayudes a orgnizar el codigo de ese archivo, ya que veo que no cumple con los patrones de diseño del proyecto y buenas practicas, ayudame a organizarlo
```
