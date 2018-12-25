export const bilateral = `
  #ifdef GL_ES
  precision mediump float;
  precision mediump int;
  #endif

  #define SIGMA 5.0
  #define BSIGMA 0.3
  #define MSIZE 5

  varying vec2 vTextureCoord;
  uniform sampler2D uSampler;
  uniform vec2 resolution;

  float normpdf(in float x, in float sigma)
  {
    return 0.39894*exp(-0.5*x*x/(sigma*sigma))/sigma;
  }

  float normpdf3(in vec3 v, in float sigma)
  {
    return 0.39894*exp(-0.5*dot(v,v)/(sigma*sigma))/sigma;
  }

  void main(void)
  {
    vec3 c = texture2D(uSampler, vTextureCoord).rgb;

    //declare stuff
    const int kSize = (MSIZE-1)/2;
    float kernel[MSIZE];
    vec3 final_color = vec3(0.0);

    //create the 1-D kernel
    float Z = 0.0;
    for (int j = 0; j <= kSize; ++j)
    {
      kernel[kSize+j] = kernel[kSize-j] = normpdf(float(j), SIGMA);
    }

    vec3 cc;
    float factor;
    float bZ = 1.0/normpdf(0.0, BSIGMA);

    //read out the texels
    for (int i=-kSize; i <= kSize; ++i)
    {
      for (int j=-kSize; j <= kSize; ++j)
      {
        cc = texture2D(uSampler, vec2(0.0, 0.0) + ( vTextureCoord + vec2(float(i),float(j)) / resolution ) ).rgb;
        factor = normpdf3(cc-c, BSIGMA)*bZ*kernel[kSize+j]*kernel[kSize+i];
        Z += factor;
        final_color += factor*cc;
      }
    }

    gl_FragColor = vec4(final_color/Z, 1.0);
  }
`;

// Portiert von https://github.com/MzHub/gpuakf/blob/master/glsl/kuwahara.glsl
export const kuwahara = `
  #ifdef GL_ES
  precision mediump float;
  precision mediump int;
  #endif

  varying vec2 vTextureCoord;
  uniform sampler2D uSampler;
  uniform vec2 resolution;

  #define RADIUS 3

  void main (void) {

    // Bildkoordinaten des aktuellen Pixels -> (u,v) von 0 .. 1
    vec2 src_size = vec2(resolution.x, resolution.y);
    vec2 uv = vTextureCoord;

    // Anzahl der Pixel einer Region
    float n = float((RADIUS + 1) * (RADIUS + 1));

    // Summen und Summenquadrate der Regionen (in Burger: (17.4 S_1,k, 17.5 S_2,k)
    // Zu beachten: Jeweils Vektoren mit 3 Elementen für die einzelnen Farbkanäle RGB
    vec3 m[4];
    vec3 s[4];
    for (int k = 0; k < 4; ++k) {
      m[k] = vec3(0.0);
      s[k] = vec3(0.0);
    }

    for (int t = -RADIUS; t <= 0; ++t) {
      for (int i = -RADIUS; i <= 0; ++i) {
        vec3 c = texture2D(uSampler, uv + vec2(i,t) / src_size).rgb;
        m[0] += c;
        s[0] += c * c;
      }
    }

    for (int j = -RADIUS; j <= 0; ++j) {
      for (int i = 0; i <= RADIUS; ++i) {
        vec3 c = texture2D(uSampler, uv + vec2(i,j) / src_size).rgb;
        m[1] += c;
        s[1] += c * c;
      }
    }

    for (int j = 0; j <= RADIUS; ++j) {
      for (int i = 0; i <= RADIUS; ++i) {
        vec3 c = texture2D(uSampler, uv + vec2(i,j) / src_size).rgb;
        m[2] += c;
        s[2] += c * c;
      }
    }

    for (int j = 0; j <= RADIUS; ++j) {
      for (int i = -RADIUS; i <= 0; ++i) {
        vec3 c = texture2D(uSampler, uv + vec2(i,j) / src_size).rgb;
        m[3] += c;
        s[3] += c * c;
      }
    }

    // Region mit der kleinsten Varianz finden und deren Mittelwert als neuen Pixelwert nutzen

    float min_sigma2 = 100.0;
    for (int k = 0; k < 4; ++k) {

      // Tatsächliche Mittelwerte und Varianzen der Regionen berechnen
      // Analog zu (17.3) in Burger
      m[k] /= n;
      s[k] = abs(s[k] / n - m[k] * m[k]);

      // "Totale Varianz"
      float sigma2 = s[k].r + s[k].g + s[k].b;

      if (sigma2 < min_sigma2) {
        min_sigma2 = sigma2;
        // Neuen Pixelwert setzen
        gl_FragColor = vec4(m[k], 1.0);
      }
    }
  }
`;
