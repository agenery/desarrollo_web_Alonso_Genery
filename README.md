# Tarea 4 - Alonso Genery

## Decesiones de implementación

- Se implementó un buscador y una evaluación con notas que están en Spring Boot, puerto 8080, mientras que el resto sigue en Flask puerto 5000. Ambas usan la misma base de datos y se enlazan entre sí desde la barra de navegación. 
- La tabla de avistamiento no tiene comuna, por tanto, se usa la comuna del voluntario que registró el avistamiento.
- La busqueda se hace con fetch en el evento de input. No distingue mayúsculas/minúsculas y busca el texto como substring del nombre del ave, del voluntario o de la comuna.
- Si llega una respuesta de una búsqueda anterior (el usuario siguió escribiendo), se descarta.
- El texto tiene un máximo de 100 caracteres.
- Las coincidencias se envuelven en <mark>. Se construyen con nodos de texto.
- Al presionar Evaluar, aparece un select con las notas del 1 al 7 y los botones para guardar y cancelar. La nota se envía con fetch y el servidor responde con el promedio recalculado desde la base de datos, que se actualiza en fila sin recargar la página.
- El promedio se muestra con un decimal junto a la cantidad de notas.
- buscador.js revisa que el número sea un entero entre 1 y 7.
- El servidor revisa que el texto sea solo de dígitos, estar entre 1 y 7, y que el avistamiento exista. Si falla, responde y la nota no se guarda.
- Se usa la misma estructura que la vista en el aux 10. Las diferencias necesarias son la versión de java, que en mi caso use la 17, como se indicó en el enunciado; y se cambió a ddl-auto=none en vez de update, ya que, Hibernate modificaba columnas existentes de la base.
- @ManyToOne se uso en Avistamiento y Voluntario, porque la base tiene tablas relacionadas.
- Se ocupo GenerationType.IDENTITY en Nota, porque la tabla nota usa AUTO_INCREMENT de MySQL.
