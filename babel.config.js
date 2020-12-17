module.exports = {
  presets: [
    '@gem-mine/app'
  ],
  plugins: [
    ['import', {
      libraryName: 'fish',
      libraryDirectory: 'es',
      style: true
    }]
  ]
}
