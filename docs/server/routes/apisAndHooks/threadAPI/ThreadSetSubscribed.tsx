/** @jsxImportSource @emotion/react */

import apiData from 'docs/server/apiData/apiData.ts';
import JsApiPage from 'docs/server/routes/apisAndHooks/JsApiPage.tsx';
import ThreadAPI from 'docs/server/routes/apisAndHooks/threadAPI/ThreadAPI.tsx';

const uri = '/js-apis-and-hooks/thread-api/setSubscribed';
const title = 'Set subscribed status';
const subtitle = `Set a thread's subscribed status for the current user`;

const jsMethodData = apiData.types.ICordThreadSDK.methods.methods.setSubscribed;

function ThreadSetSubscribed() {
  return (
    <JsApiPage
      parent={ThreadAPI}
      title={title}
      subtitle={subtitle}
      jsMethodData={jsMethodData}
    />
  );
}

export default {
  uri,
  title,
  subtitle,
  Element: ThreadSetSubscribed,
};