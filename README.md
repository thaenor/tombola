# Virtual Lottery - WebGL

## Running this project

1. Clone the repo
2. Use a local HTTP server to serve the project folder (suggested [Web Server for Chrome](https://github.com/kzahel/web-server-chrome), [direct link to store](https://chrome.google.com/webstore/detail/web-server-for-chrome/ofhbbkphhbklhfoeikjpcbhemlocgigb))
3. Open the browser - Recommended to use Google Chrome with the latest updated version.


You may also use [simpleHTTPServer](https://www.pythonforbeginners.com/modules-in-python/how-to-use-simplehttpserver) or if you're using VS Code, the extension [Live server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer).


## Tools used

* Three JS
* PhysiJS (and ammo.js)
* Toastr (for notifications)

## Architecture and major implementation

The main idea was to mimic the tombola of the random lottery drafts. Numbered balls would bounce around, a specific number would be drafted and the player would win or lose based on the numbers he betted on.

The initial idea was to implement a rotating sphere (the tombola), and have a series of smaller spheres bouncing around. Here is a [Sandbox](https://codesandbox.io/s/the-wheel-draft-9cd90) displaying an example of the initial idea. The smaller spheres are already using a texture, and randomly placed somewhere inside the tombola. (No physics exist at this stage).

The chosen library of physics (Physijs) uses service-workers internally, to run in parallel to the main event loop and maintain the page interactivity (there are some caveats to this implementation, which will be elaborated on).

Each ball is generated randomly, using a 3D font mesh inside it to render the corresponding number. Due to this it is possible to have as many spheres as we want (provided they fit the scene).

Due to an issue regulating physics collisions within the spheres, it was not possible to rely on the initial tombola sphere. As a fallback a box is used instead - since this is composed of different meshes, the centre can remain "hollow" where the spheres will bounce around.

Once the user clicks the "draw" button, an animation moves the selected spheres to the centre of the screen and the credits are calculated.

### Known issues

The physics library is rather outdated, it limited some implementation decisions and is the main cause of some issues. There is a bug in how the pause feature is implemented within the library. Even though the animation is paused, the physics calculations will still run in the servicer-worker and update its location (even though the animations do not update). The only solution around this problem is to migrate to a different physics engine, which was not possible due to time constraints.
