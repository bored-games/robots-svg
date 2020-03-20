# :robot: robots-svg :robot: Solutions Visualizer :robot:
A javascript SVG and PNG generator for visualizing puzzle solutions

## Usage
  Dynamically generate an SVG for visualizing a puzzle and solution. URL arguments:

  Parameter | Format | Argument
  --------- | ------ | --------
  **goal** | `c,n` | where a color is `c ∈ {r, g, b, y, s}` and `n` is a cell number (0-255) where the goal appears.
  **red** | `n` | where `n` is a cell number (0-255) where the red robot appears.
  **green** | `n` | where `n` is a cell number (0-255) where the green robot appears.
  **blue** | `n` | where `n` is a cell number (0-255) where the blue robot appears.
  **yellow** | `n` | where `n` is a cell number (0-255) where the yellow robot appears.
  **silver**  | `n` | where `n` is a cell number (0-255) where the silver robot appears.
  **m**\* | `c,n,sx,sy,ex,ey` | Each move is represented by a color `c ∈ {r, g, b, y, s}`, a starting coordinate `(sx, sy)` and an ending coordinate `(ex, ey)`. Any number of **m** can be included in the URL. Moves will be numbered from first to last as they appear in the URL string.
  **b** | `n1,...,n256` or `<base64 n1..n256>` | Either a comma-separated list of 256 numbers corresponding to wall-encodings, or a base64 encoded version of the data (with no commas).


  ### Example:

  > localhost/robots-svg/solution.html?goal=166&red=33&green=221&blue=237&yellow=205&silver=253&b=2ZOZkZGRkZGTmZGRkZGRs8gAACBEAAAAAAAAACBEADLIJEASiQAAAAAAAAASiQA2zBOIAAAAAAAAAAAAAAAAM8kAACJMAAAAAAAiTAAkQDLIAAAQgQAAAAAAEIEAE4gyyCZIAAAAIGRkQAAAAAAmesgRgAAAADL//8gAAAAAEbLIAAAAAAAy///IAAAAAAAyyAAkQAAAEJGRgAAAAAAAMsgAE4gAIEQAIEQAAAAAADLMAAAAABKJABKJJkgAAAAyyQAAIkwAAAAAABGAACJMMsgAABCBACZIACRAAAAQgTbIAAAAAAARgAATiAAAAAAz7GRkZGRmbGRkZGRkZmxkdg==&m=g,13,13,7,13&m=g,7,13,7,9&m=r,1,2,3,2&m=r,3,2,3,0&m=r,3,0,2,0&m=r,2,0,2,9&m=r,2,9,6,9&m=r,6,9,6,10