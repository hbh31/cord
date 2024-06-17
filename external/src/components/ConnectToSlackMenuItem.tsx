import type { MouseEvent } from 'react';
import { useCallback, useState } from 'react';
import type { Editor } from 'slate';
import { useCordTranslation } from '@cord-sdk/react';
import { INTEGRATION_CONNECT_SLACK_NUX_SEEN } from 'common/const/UserPreferenceKeys.ts';
import { usePreference } from 'external/src/effects/usePreference.ts';
import { useLogger } from 'external/src/logging/useLogger.ts';
import { useConnectWithSlack } from 'external/src/effects/useConnectWithSlack.ts';
import { EditorCommands } from 'external/src/editor/commands.ts';
import { Button2 } from 'external/src/components/ui2/Button2.tsx';
import { Separator2 } from 'external/src/components/ui2/Separator2.tsx';
import { useContextThrowingIfNoProvider } from 'external/src/effects/useContextThrowingIfNoProvider.ts';
import { withNewCSSComponentMaybe } from 'external/src/components/ui3/withNewComponent.tsx';
import { newConnectToSlackMenuItem } from 'external/src/components/ui3/ConnectToSlackMenuItem.tsx';
import { ConfigurationContext } from 'external/src/context/config/ConfigurationContext.ts';
import { ThreadsContext2 } from 'external/src/context/threads2/ThreadsContext2.tsx';

type PromptStatus = 'begin' | 'in-progress';

type Props = {
  editor: Editor;
  isSlackWorkspaceConnected?: boolean;
};

export const ConnectToSlackMenuItem = withNewCSSComponentMaybe(
  newConnectToSlackMenuItem,
  function ConnectToSlackMenuItem({
    editor,
    isSlackWorkspaceConnected,
  }: Props) {
    const { t } = useCordTranslation('composer');
    const [promptStatus, setPromptStatus] = useState<PromptStatus>('begin');
    const [connectToSlackNuxSeen, setConnectToSlackNuxSeen] = usePreference(
      INTEGRATION_CONNECT_SLACK_NUX_SEEN,
    );
    const { enableSlack } =
      useContextThrowingIfNoProvider(ConfigurationContext);

    const { logEvent } = useLogger();

    const onSuccess = useCallback(() => {
      if (!connectToSlackNuxSeen) {
        setConnectToSlackNuxSeen(true);
      }
      EditorCommands.focusAndMoveCursorToEndOfText(editor);
    }, [connectToSlackNuxSeen, setConnectToSlackNuxSeen, editor]);

    const onError = useCallback(() => {
      setPromptStatus('begin');
    }, [setPromptStatus]);

    const connectToSlackFlow = useConnectWithSlack({ onSuccess, onError });

    const { location } = useContextThrowingIfNoProvider(ThreadsContext2);

    const handleOnConnect = useCallback(
      (e: MouseEvent) => {
        e.stopPropagation();
        logEvent('click-mention-list-connect-slack');
        setPromptStatus('in-progress');
        connectToSlackFlow();
      },
      [logEvent, connectToSlackFlow],
    );

    if (isSlackWorkspaceConnected || !enableSlack || location === 'inbox') {
      return null;
    }

    switch (promptStatus) {
      case 'begin':
        return (
          <>
            <Separator2 />
            <Button2
              buttonType="primary"
              icon="Slack"
              size="medium"
              isFullWidth={true}
              onClick={handleOnConnect}
            >
              {t('connect_to_slack_action')}
            </Button2>
          </>
        );
      case 'in-progress':
        return (
          <>
            <Separator2 />
            <Button2
              buttonType="primary"
              icon="Slack"
              size="medium"
              onClick={handleOnConnect}
              disabled={true}
              isFullWidth={true}
            >
              {t('slack_follow_instructions')}
            </Button2>
          </>
        );
    }
  },
);
