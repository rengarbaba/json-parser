const fs = require('fs');

fs.readFile('messages_1.json', 'utf8', (err, data) => {
  if (err) {
    console.error('JSON dosyası okunurken hata oluştu:', err);
    return;
  }

  const json = JSON.parse(data);
  let arananDegerler = [];


  fs.readFile('buffer.json', 'utf8', (err, bufferData) => {
    if (err) {
      console.error('Buffer dosyası okunurken hata oluştu:', err);
      return;
    }

    const bufferJson = JSON.parse(bufferData);


    bufferJson.cc_bins.forEach((bin) => {
      arananDegerler.push(bin.bin_number);
    });

    const bulunanSonuclar = ara(json, arananDegerler);

    console.log("Aranan Değerler: ", arananDegerler);
    console.log("Sonuçlar: ", bulunanSonuclar);

    kaydetSonuclari("sonuclar.txt", bulunanSonuclar);
  });
});

function kaydetSonuclari(dosyaAdi, sonuclar) {
  let dosyaIcerik = "";

  for (let i = 0; i < sonuclar.length; i++) {
    dosyaIcerik += JSON.stringify(sonuclar[i]) + "\n";
  }

  fs.writeFile(dosyaAdi, dosyaIcerik, (err) => {
    if (err) {
      console.error('Sonuçlar dosyaya kaydedilirken hata oluştu:', err);
      return;
    }

    console.log('Sonuçlar başarıyla dosyaya kaydedildi:', dosyaAdi);
  });
}

function ara(obj, arananDegerler) {
  const sonuclar = [];

  function araRecursive(obj, arananDegerler) {
    if (obj instanceof Array) {
      for (let i = 0; i < obj.length; i++) {
        araRecursive(obj[i], arananDegerler);
      }
    } else if (typeof obj === 'object') {
      for (let key in obj) {
        if (key !== 'id') {
          araRecursive(obj[key], arananDegerler);
        }
      }
    } else if (typeof obj === 'string') {
      for (let i = 0; i < arananDegerler.length; i++) {
        if (obj.includes(arananDegerler[i])) {
          sonuclar.push(obj);
          break;
        }
      }
    }
  }

  araRecursive(obj, arananDegerler);

  return sonuclar;
}
