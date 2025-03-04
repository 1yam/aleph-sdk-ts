import { BaseMessage } from "../types";
import { Account } from "../../accounts/account";
import axios from "axios";
import { getSocketPath, stripTrailingSlash } from "../../utils/url";

type SignAndBroadcastConfiguration = {
    message: BaseMessage;
    account: Account;
    APIServer: string;
};

type BroadcastConfiguration = SignAndBroadcastConfiguration;

export async function SignAndBroadcast(configuration: SignAndBroadcastConfiguration): Promise<void> {
    configuration.message.signature = await configuration.account.Sign(configuration.message);
    await Broadcast(configuration);
}

async function Broadcast(configuration: BroadcastConfiguration) {
    try {
        await axios.post(
            `${stripTrailingSlash(configuration.APIServer)}/api/v0/ipfs/pubsub/pub`,
            {
                topic: "ALEPH-TEST",
                data: JSON.stringify(configuration.message),
            },
            {
                socketPath: getSocketPath(),
            },
        );
    } catch (err) {
        console.warn(err);
    }
}
