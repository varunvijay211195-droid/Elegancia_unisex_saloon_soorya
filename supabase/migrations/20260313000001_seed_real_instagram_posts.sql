-- Clear existing mock posts (so you only have the real ones)
DELETE FROM public.instagram_posts;

-- Insert real posts from the Elegancia Instagram catalog
INSERT INTO public.instagram_posts (caption, image_url, permalink, media_type, is_reel, is_featured, display_order)
VALUES 
(
  'elegancia_unisex_salon A happy smile says it all! 💇‍♀️✨ Another satisfied client at Elegancia Unisex Salon – where beauty meets perfection. 💖 Thank you for trusting us with your glow-up! 📍Book your shine today! 9605550666 #happycustomer #eleganciasalon', 
  'https://instagram.ftrv3-1.fna.fbcdn.net/v/t51.82787-15/515493390_17845720410515220_8450828767149891942_n.webp?stp=dst-jpg_e35_p1080x1080_sh0.08_tt6&_nc_ht=instagram.ftrv3-1.fna.fbcdn.net&_nc_cat=100&_nc_oc=Q6cZ2QG-BEJiAIyvjvfGbTzdG4nHdBtfuBEMwZWVbT3mVeRBOLzqh54BBPTYgBeNzapGY6o&_nc_ohc=iEAor9CH5jIQ7kNvwGi1SG4&_nc_gid=Z0llkiXfP_v1T5M7WD4kZA&edm=APs17CUBAAAA&ccb=7-5&oh=00_AfzJpJIgO_zxCR7WGyBj1GA5mrgyOkMjaVfxsT6Z0Bto1w&oe=69B74C70&_nc_sid=10d13b', 
  'https://www.instagram.com/p/DLmqaE7yhwi/', 
  'IMAGE', 
  false, 
  true, -- This one is set as FEATURED (large box)
  1
),
(
  'soorya_makeupartist Airbrush makeover for my beautiful bride Dr Reshma ✨.', 
  'https://instagram.ftrv3-1.fna.fbcdn.net/v/t51.82787-15/618491352_17891228775408250_8363371682847756895_n.jpg?stp=dst-jpg_e35_s1080x1080_sh0.08_tt6&_nc_ht=instagram.ftrv3-1.fna.fbcdn.net&_nc_cat=110&_nc_oc=Q6cZ2QHdpSsWYs7xogHjVr0oYb5TMS733HA9YhJrwSapw5knJ-A13SLakNVHt5DtEbk5QJg&_nc_ohc=wBd-fTov0ggQ7kNvwEUy9Qi&_nc_gid=TnK7cBIBTDqp20VjJjMfRA&edm=APs17CUBAAAA&ccb=7-5&oh=00_AfyUwQql4Sh5NyqCTQnLKZoBDPdiS9AAdYjiHMDhT1X9og&oe=69B76174&_nc_sid=10d13b', 
  'https://www.instagram.com/p/DMNaUQXJecX/', 
  'IMAGE', 
  false, 
  false, 
  2
),
(
  'elegancia_unisex_salon Bold. Beautiful. Bugadi! ✨ Enhance your traditional charm with our flawless Bugadi Piercing service at Elegancia Unisex Salon.', 
  'https://instagram.ftrv3-1.fna.fbcdn.net/v/t51.82787-15/526327636_17850546396515220_1318749281536711260_n.jpg?stp=dst-jpg_e15_tt6&_nc_ht=instagram.ftrv3-1.fna.fbcdn.net&_nc_cat=100&_nc_oc=Q6cZ2QGzvcrQl4reBPjUwhTsre-c_7hiXsiGapCOmD6brrNNnSGTs5yAhbap7Vs0aPphR7s&_nc_ohc=UiD6t8qTFrEQ7kNvwEZwFJ9&_nc_gid=uOqzT0uXnbMsOYilUncREw&edm=APs17CUBAAAA&ccb=7-5&oh=00_AfzA_OK9GktFTRBNTSsrYDQI3jnNRQ1vDomWyxcsIdhsZg&oe=69B75239&_nc_sid=10d13b', 
  'https://www.instagram.com/reel/DMxUI1xy9J0/', 
  'VIDEO', 
  true, 
  false, 
  3
),
(
  'soorya_makeupartist Hd matt finish skin tone makeover done for my dear bride Akhila ❤️.', 
  'https://instagram.ftrv3-1.fna.fbcdn.net/v/t51.82787-15/627678968_18083793925967071_1193772934987606000_n.jpg?stp=dst-jpg_e35_s1080x1080_sh0.08_tt6&_nc_ht=instagram.ftrv3-1.fna.fbcdn.net&_nc_cat=107&_nc_oc=Q6cZ2QGTJk1xJCOCSNkrbGSVca_VvEQwi0R7f5bf5EGrJQmqUk4jKGlr45Mg-9Rpdfhmuv0&_nc_ohc=MJTOfHwO3rcQ7kNvwGGv4pk&_nc_gid=wDom5YmFyXk97BLtARbAtQ&edm=APs17CUBAAAA&ccb=7-5&oh=00_AfxZODfe8Xk_1q3bgYrEEFy9gsS-q0b5BjUUQQFbckCK6g&oe=69B76028&_nc_sid=10d13b', 
  'https://www.instagram.com/p/DNQt8FAp5Md/', 
  'IMAGE', 
  false, 
  false, 
  4
),
(
  'soorya_makeupartist Airbrush glowy skintone makeover done for my gorgeous bride CHITHIRA ❤️✨', 
  'https://instagram.ftrv3-1.fna.fbcdn.net/v/t51.82787-15/642532078_17885524059452530_1072455105201569234_n.jpg?stp=dst-jpg_e35_p1080x1080_sh0.08_tt6&_nc_ht=instagram.ftrv3-1.fna.fbcdn.net&_nc_cat=110&_nc_oc=Q6cZ2QGVsdn1mpMQVjB0ut8uZwAkjfdvxyEsMzs2sUlLvf4EcOkD9dlul6nrXjPxBM5q6lc&_nc_ohc=yi1ogM6P46gQ7kNvwETmqSC&_nc_gid=D8TH3KvJybKwh71MFGM1AQ&edm=APs17CUBAAAA&ccb=7-5&oh=00_AfzKHezATIGhe4ipjWuMyl3uE5mZaECFdiDN6up9C-FIHQ&oe=69B755F6&_nc_sid=10d13b', 
  'https://www.instagram.com/p/DNQrAunJ_9U/', 
  'IMAGE', 
  false, 
  false, 
  5
),
(
  'elegancia_unisex_salon Smooth. Sleek. Stunning. Experience the magic of Brazilian Botox + Permanent Blowdry at Elegancia Unisex Salon.', 
  'https://instagram.ftrv3-1.fna.fbcdn.net/v/t51.82787-15/525138238_17850285921515220_8750422590152937393_n.jpg?stp=dst-jpg_e15_tt6&_nc_ht=instagram.ftrv3-1.fna.fbcdn.net&_nc_cat=100&_nc_oc=Q6cZ2QH9smvm1ufRK2LP8EQ8TFL7wxpgourDmYlyiqXm2Wj85GTd5s-kQwPld8dU9girmAY&_nc_ohc=78_dF2r8eq8Q7kNvwGUEjXg&_nc_gid=ZnOwz7WrnbFWxOLXWXMseg&edm=APs17CUBAAAA&ccb=7-5&oh=00_AfyCwRSE4DuvXo8I7kzixyL-UTfEHLE0LPTX_GwZJ5BN4Q&oe=69B74895&_nc_sid=10d13b', 
  'https://www.instagram.com/reel/DMsM9hgSoP2/', 
  'VIDEO', 
  true, 
  false, 
  6
);
