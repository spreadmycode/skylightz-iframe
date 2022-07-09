// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {
  GETSTREAM_API_KEY,
  GETSTREAM_API_SECRECT_KEY,
  GETSTREAM_OWNER_ID,
} from "@/libs/constants";
import type { NextApiRequest, NextApiResponse } from "next";
import { connect } from "getstream";
import { initFirebase } from "@/libs/firebase";
import { doc, getDoc } from "firebase/firestore";

type Data = {
  message?: string;
  error?: string;
};

const firebase = initFirebase();

const getUserData = async (uid: string) => {
  if (!firebase) return null;

  const userDoc = doc(firebase.db, "users", uid);
  const user = await getDoc(userDoc);
  if (user.exists()) {
    let data = {
      id: user.data()?.id,
      userId: user.data()?.userId,
      userName: user.data()?.userName,
      userChatToken: user.data()?.userChatToken,
      userActivityToken: user.data()?.userActivityToken,
      avatar: user.data()?.avatar,
    };
    return data;
  }
  return null;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method != "POST") {
    return res.status(400).json({ error: "It should be POST method." });
  }

  try {
    const {
      topic,
      title,
      description,
      url,
      images,
      contractAddress,
      walletAddress,
    } = req.body;

    let userName = walletAddress;
    if (walletAddress) {
      const user = await getUserData(walletAddress);
      if (user) {
        userName = user.userName;
      }
    } else {
      return res.status(400).json({ error: "Parameters are incorrect." });
    }

    if (
      topic &&
      title &&
      description &&
      url &&
      images &&
      contractAddress &&
      GETSTREAM_API_KEY &&
      GETSTREAM_API_SECRECT_KEY
    ) {
      let client = connect(GETSTREAM_API_KEY, GETSTREAM_API_SECRECT_KEY);

      let feed = client.feed("timeline", "timeline");
      await feed.addActivity({
        actor: client.user("timeline").ref(),
        verb: "tweet",
        object: topic,
        attachments: {
          og: {
            title: `${title} by ${userName}`,
            description,
            url,
            images,
          },
        },
      });

      return res.status(200).json({ message: "Success" });
    } else {
      return res.status(400).json({ error: "Parameters are incorrect." });
    }
  } catch (e: any) {
    console.log(e);
    res.status(400).json({ error: e?.message });
  }
}
