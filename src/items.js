const products = [
    { id: 1, 
     image: <img src='https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcRuIsjv0Me_pVfPu6uszaH9p46vXRGs4D6m4G8iUaRtvcrGQRKbJUZQwgJFhHZbVte0STx67qPtYm1wSsZ65mZR643kr6gkLWNMjEjJfkcKfBLyOWgPy5xY5XmwDMV4vV_0fcWCDcE&usqp=CAc' alt=""></img>, 
     name: 'Polo Green', 
     price: 50,
    description: 'Polo Green is also known as the Polo Classic fragrance for men by Ralph Lauren. It is a classic masculine fragrance with intense notes of pine wood with undertones of grass, floral and fruity notes. It is an elegant, classy and unique fragrance created especially for men.' },
    { id: 2, 
     image: <img src='https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcREys6jLtRbHg26a2YPMjXSLH2xvIrolPru8Olyjf3tB-bd-B4K4Dm_-qGl4-9-kkubTqd6khoClYl43OUoPfDqnliSjavpUJ8wvu7uIDvJ1MgrRNjCBUqLQSc7-20RT9_9p_3W2vs6dQ&usqp=CAc' alt=""></img>, 
     name: 'Obsession', 
     price: 150, 
     description: 'Between love and madness lies OBSESSION. This spicy oriental is a provocative and compelling blend of botanics and rare woods.'},
    { id: 3, 
     image: <img src='https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcRwBbLe6NzaYM8hsLp8HPxFE15zo5EDfNCR3GWdji1PFIE_qY9aNgdDDOYryO1CR4dIMZPwtT83VKA_JvXYP91EAR-FfaONEI5YHgMNjDP9ynj3fz_V8FdiSE5bYboGjlkMk5Wx9Pdwhg&usqp=CAc' alt=""></img>, 
     name: 'Curve', 
     price: 200, 
     description: 'Curve for Men is an intriguing cologne with a feeling of excitement and adventure in every spritz. Fresh green notes start this masculine scent, as a tangy citrus heart combines with a layer of amber and woods for a bold, provocative finish.'},
    { id: 4, 
     image: <img src='https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcS1y3tIdQpHilw0aenHrZQaJQP8sT2acs6ABYBvk3OFeD1yCHfP_hYUXiuQhCh5Q4pQJUTH_Nl-IwI7jsRdqfCjwwW_S2lnAGx5O276omPm8NWzie4Vjowy7N15DUrPul6c3w5TrzQB&usqp=CAc' alt=""></img>, 
     name: 'Boss', 
     price: 300, 
     description: 'The abstract of Hugo Boss style is captured in a bottle with Boss Bottled aroma. The fragrance is fresh and sharp with warm woody base. The fresh and fruity top notes of apple and citrus are perfectly balanced with floral and spicy heart, dominated by pelargonium, warm cinnamon, and cloves.'},
    { id: 5, 
      image: <img src='https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRVmOAwO-dxruF1WtAdZuV9FOrT7tzZvn-oTPd1GUGICB80CcK50HkixL4qkuKCMCH5ILCkCFidm8yLJ9QmgQFpATvMQCOxsQTIcL3_wDdlX_yIWCUm-PZDat5KRS5NQuURhdh3v4y4&usqp=CAc' alt=""></img>, 
      name: 'Eternity', 
      price: 100, 
      description: 'Eternity Cologne is an aromatic fougere fragrance for men with key scent notes of mandarin, lavender, jasmine, basil, sandalwood, and vetiver. Its like strolling through a citrus garden laden with orange and lemon blossoms.'},
    { id: 6, 
      image: <img src='https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQ5Y9FBs2fPlRhdQh2AA8IIm2N8GpJTrfcJ40b5ehTQkZqRiN5enjTUu_tM53RjIVDMiWHVCDt3HeGv9gprvCBEzrp6DqeFKlBtq8qcC4IZAN8KqRix5whpSrnaaYsMM9mZkrSTMnlomyE&usqp=CAc' alt=""></img>, 
      name: 'Legend', 
      price: 250, 
      description: 'Legend for Men is a classic fragrance that has been around for over 80 years. It is a warm and spicy scent that is perfect for any occasion. The top notes of this fragrance are bergamot, lavender, and citrus, while the middle notes are rosemary, jasmine, and geranium.'},  
      { id: 7, 
       image: <img src='https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcSu6wdM9LL6yJS5Q4fytel6-xTmV2vwNVks-vX42P2-tAH9Qo8m7DLJnNx6zPMuYUDvQdeA1fqiiuktMh-IWuvwZ0xDAFLw1Xe87Ou-nzIrcF8hgZtC8u24HQ&usqp=CAE' alt=""></img>, 
       name: 'Creed', 
       price: 365, 
       description: 'Perfect for the daring, urban-spirited man, this Eau de Parfum is inspired by a classic uplifting cologne; revitalizing the wearer with alluring fresh vigor. A fruity yet aromatic burst of ginger, mandarin and pink peppercorn is complemented by a sumptuous heart of patchouli, sandalwood and vetiver. A leathery balsamic base of styrax, birch, musk and tonka provides the final touch to this vibrant scent. A cult classic with a rebellious modern twist, Aventus Cologne embodies vitality, success, true grit and style.'},
     { id: 8, 
       image: <img src='https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcSDKz69gjv7tc9B3NYU2xWsjfuzSjZCBgz2jUV7ILcmrtV28EVE6hDZtG_vWKQPUyzHZ5bYMzzRys5MV-nQtcD1FAOk7nCP8SDb8duUGk7tppMimb5zpVC8&usqp=CAE' alt=""></img>, 
       name: 'Polo Blue', 
       price: 99, 
       description: 'A blend of juicy, watery melon delivers an invigorating burst of freshness complemented by the smooth aromatic notes of Sage and Basil Verbena.'},   
    // Add more products as needed
  ];
  
  export default products;
  