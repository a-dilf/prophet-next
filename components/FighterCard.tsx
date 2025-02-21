import { Stack, Typography } from "@mui/material";
import styles from "../src/styles/HomePage.module.css";

interface Line {
  fighter_name: string;
  odds: string;
  units: number;
}

interface Card {
  [key: string]: Line;
}

interface FighterCardProps {
  data: {
    _id: { $oid: string };
    card: Card;
    thoughts: string;
    card_title: string;
  }[];
}

function FighterCard({ data }: FighterCardProps) {
  return (
    <div>
      {data.map((item) => (
        <div key={item._id.$oid} className="container" style={{ paddingTop: "15px" }}>
          <Typography className={styles.container} variant="h5" style={{ paddingTop: "15px", paddingBottom: "15px" }}>
            {item.card_title}
          </Typography>
          <Stack spacing={2}>
            {Object.entries(item.card).map(([key, line]) => (
              <div key={key}>
                <Typography>
                  {line.fighter_name} at {line.odds} | Units: {line.units}
                </Typography>
              </div>
            ))}
            <Typography style={{ paddingBottom: "15px" }}>Thoughts: {item.thoughts}</Typography>
          </Stack>
        </div>
      ))}
    </div>
  );
}

export default FighterCard;
