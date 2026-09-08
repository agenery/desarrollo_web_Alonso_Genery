# Detalles de Tarea 1 - Alonso Genery

## Index
Esta es la página incial de la página. Se implemento una bienvenida, imitando las de las páginas profesionales, que invita al usuario a ser parte de los aportadores de aves. Se implemento además links a todo el resto de los html involucrados, para generar esa sensación de navegación.

Para el CSS lo hice lo más simple posible. Use el visto en auxiliares, y lo modifique según veia necesario para lograr sintonía entre todas las páginas del proyecto, para que se viera más limpio y parezca más una página real.

## Registro
Acá utilice lo visto en clases para generar las válidaciones. En general son simples, pueden pasar varios goles, pero con las herramientas vistas hasta este momento, siento que abarcan lo más importante y mantienen una cierta lógica para que todo funcione de manera semi natural. Al registrarse de manera exitosa, el usuario obtiene una ventana que lo invita ahora a registrar algún avistamiento, haciedolo más realista a como si fuera una página de verdad, aunque aún así, se puede registrar un ave sin registrar usuario.

## Avistamiento

Siguiendo la lógica anterior, se uso lo visto en clases para regular cada apartado. Para la fecha se utilizaron funciones que permiten saber el día y hora en el que estamos, para que así se respete el hecho de que solo puede ingresar aves vistas desde el día de hoy hasta hace un año atrás.

## Listado

Para este se usan aves de ejemplos que simulan como sería la vista luego del registro de las aves. Como todavía no podemos ocupar session o local Storage, simplemente damos el ejemplo de como se vería esta interfaz. Inicialmente solo se ven 5 aves, pero pasando página se pueden ver el resto de estas que están "registradas". 

Se implementó además una lógica de busqueda para el usuario, para que este encuentre rápidamente lo que busca. Se ordena primero según cuando ingresaron a la página, pero se puede filtrar por tipo de ave, así como por fecha de avistamiento y por lugar en orden alfabético.

## Estadísticas

Para esta parte simplemente dibuje estadísticas de ejemplo (por la misma razón que en el listado), que simulen estadísticas reales de una página de este calibre. Para esto simplemente dibuje un gráfico de barras usando divs, y sin ocupar librerias ni archivos externos.
