import { Box } from '@/components/atomics/Box';
import { HorizontalRule } from '@/components/atomics/HorizontalRule';
import Image from 'next/image';
import { PostingImage } from '@/components/atomics/PostingImage';
import { Stack } from '@/components/atomics/Stack';
import { Text } from '@/components/atomics/Text';

export default function Home() {
  return (
    <>
      <div style={{ height: '80dvh', position: 'relative', width: '100%' }}>
        <Image
          alt=""
          style={{ objectFit: 'cover' }}
          fill={true}
          src="/image/HighRes_007_2018-04-11_Rene-Voglmayr-Running_WEISS-auslaufend.png"
        />
        <div
          style={{
            left: '50%',
            position: 'absolute',
            top: '50%',
            transform: 'translate(-70%,-70%)',
            width: '20rem',
          }}
        >
          <Box padding="normal">
            <Text color="primary" fontSize="heading3">
              <h1>#50runs</h1>
              Gemeinsam fit durch den Winter kommen und etwas Gutes tun. Was ist
              Deine Challenge?
            </Text>
          </Box>
        </div>
      </div>
      <Box maxWidth="tablet" padding="normal">
        <Stack direction="column" gap="double">
          <Box textAlign="center">
            <Text color="primary" fontSize="heading2">
              <Stack direction="column" gap="normal">
                <h2>Was?</h2>
                Ich komme mit 50 Läufen fit durch den Winter und spende für
                jeden Lauf an die Herzkinder Österreich. Was ist Deine
                Challenge?
              </Stack>
            </Text>
          </Box>

          <HorizontalRule border="bold" color="secondary" />

          <Box textAlign="center">
            <Text color="primary" fontSize="heading2">
              <Stack direction="column" gap="normal">
                <h2>Wann?</h2>
                Die #50runs starten am 1. Oktober 2023 wieder los!
              </Stack>
            </Text>
          </Box>

          <HorizontalRule border="bold" color="secondary" />

          <Box textAlign="center">
            <Text color="primary" fontSize="heading2">
              <Stack direction="column" gap="normal">
                <h2>Warum?</h2> Für mich selbst: um fit durch den Winter zu
                kommen – für andere:
                <br />
                um ein klein wenig zu helfen.
                <Box
                  color="secondary"
                  padding="double"
                  roundedCorners={true}
                  textAlign="start"
                  variant="outlined"
                >
                  <Text color="primary" fontSize="sub">
                    <strong>Wieso 50 Läufe?</strong>
                    <br />
                    Auf einem meiner Laufausflüge im Herbst 2013 hatte ich die
                    Idee eine bestimmte Anzahl an Läufen im Winter zu schaffen.
                    Einfach um ein wenig Sport zu betreiben. Und irgendwie kam
                    ich von 50 Läufen auf Fifty Shades of Grey und davon
                    wiederum auf Fifty Runs `till May 😉 Wiederum bei einem
                    Laufausflug hat mich ein Freund (Danke Stefan!) dann auf die
                    Idee gebracht die 50 Läufe unter einen Charity-Stern zu
                    stellen. Im Herbst 2023 starten die 50runs zum 11. Mal.
                  </Text>
                </Box>
              </Stack>
            </Text>
          </Box>

          <HorizontalRule border="bold" color="secondary" />

          <Box textAlign="center">
            <Text color="primary" fontSize="heading2">
              <Stack direction="column" gap="normal">
                <h2> Wie?</h2>
                Von Anfang Oktober 2023 bis 30. April 2024 versuche ich die 50
                Läufe zu schaffen. Und ich gehe davon aus, dass es ein paar mehr
                werden 😉 Und natürlich freue ich mich über jede Aufmunterung
                auf Instagram, Facebook und Twitter („likes“) den inneren
                Schweinehund zu überwinden und Laufen zu gehen!
                <PostingImage image="/image/LowRes_009_2018-04-11_Rene-Voglmayr-Running-1.jpeg" />
                <Box
                  color="secondary"
                  padding="double"
                  roundedCorners={true}
                  textAlign="start"
                  variant="outlined"
                >
                  <Stack
                    directionOnMobile="column"
                    gap="normal"
                    layout="2x1"
                    layoutOnMobile="1"
                  >
                    <Text color="primary" fontSize="sub">
                      <strong>
                        Wie funktioniert die Spende an die Herzkinder Ö?
                      </strong>
                      <br />
                      Ein Euro für jeden Lauf geht an die Herzkinder Österreich,
                      für jeden den ich zusätzlich schaffe natürlich auch. So
                      wie in den letzten Jahren werde ich auch für Eure „likes“
                      auf Facebook, Twitter & Co. noch etwas drauflegen 🙂
                    </Text>
                    <PostingImage image="/image/hkoe.png" />
                  </Stack>
                </Box>
              </Stack>
            </Text>
          </Box>

          <HorizontalRule border="bold" color="secondary" />

          <Box textAlign="center">
            <Text color="primary" fontSize="heading2">
              <Stack direction="column" gap="normal">
                <h2>Wer?</h2>
                Rund 50 begeisterte LäuferInnen und UnterstützerInnen waren bei
                den letzen #50runs mit dabei. Lass dich von ihnen begeistern!
                <Stack
                  gap="normal"
                  layout="3"
                  directionOnMobile="column"
                  layoutOnMobile="1"
                >
                  <Box
                    color="secondary"
                    padding="normal"
                    roundedCorners={true}
                    variant="outlined"
                  >
                    <Text color="primary" fontSize="sub">
                      Die 50 Runs verbinden einfach alles, wofür ich stehe:
                      niemals aufhören sich zu bewegen, Läufe zu einem Fixpunkt
                      mit Freunden machen, soziale Projekte unterstützen und den
                      eigenen Körper bei jedem Wind und Wetter abhärten. Mit den
                      anderen 50runners ein gemeinsames Ziel vor Augen zu haben
                      motiviert mich - da gibts dann auch im Winter keine
                      Ausreden.
                    </Text>
                  </Box>
                  <Box
                    color="secondary"
                    padding="normal"
                    roundedCorners={true}
                    variant="outlined"
                  >
                    <Text color="primary" fontSize="sub">
                      #50runs ist für mich eine tolle Idee. Etwas Gutes tun und
                      dabei Körper und Geist über die Wintermonate fit halten.
                      Ob ich meine 139 Runs vom Vorjahr wiederholen kann wird
                      sich zeigen. Ich wünsche allen eine erfolgreiche und
                      verletzungsfreie Zeit und würde mich freuen, wenn wir so
                      manchen gemeinsamen Lauf zusammen absolvieren können.
                      Happy Running!
                    </Text>
                  </Box>
                  <Box
                    color="secondary"
                    padding="normal"
                    roundedCorners={true}
                    variant="outlined"
                  >
                    <Text color="primary" fontSize="sub">
                      #50runs bedeutet für mich Soziales mit Schönem und
                      Gesundem zu verbinden. Die Zeit von Oktober bis Ende April
                      bietet in der Natur alle Facetten die man sich vorstellen
                      kann. Da draussen zu laufen heisst für mich Batterien
                      aufladen und Spass mit Gleichgesinnten haben. Werde auch
                      du ein #50runner und Happy Running!
                    </Text>
                  </Box>
                </Stack>
              </Stack>
            </Text>
          </Box>

          <HorizontalRule border="bold" color="secondary" />

          <Box textAlign="center">
            <Text color="primary" fontSize="heading2">
              <Stack direction="column" gap="normal">
                <h2>Teile die Idee!</h2>
                Benutze den Hashtag #50runs und folge uns auf:{' '}
                <a href="https://www.facebook.com/50runs" target="_blank">
                  Facebook
                </a>{' '}
                <a href="https://www.instagram.com/50runs" target="_blank">
                  Instagram
                </a>
              </Stack>
            </Text>
          </Box>
        </Stack>
      </Box>
    </>
  );
}
