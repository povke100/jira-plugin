package lt.povilass.jirap.plugin.impl;

import com.atlassian.sal.api.ApplicationProperties;
import lt.povilass.jirap.plugin.api.JiraPComponent;


public class JiraPComponentImpl implements JiraPComponent {

    private final ApplicationProperties applicationProperties;

    public JiraPComponentImpl(final ApplicationProperties applicationProperties) {
        this.applicationProperties = applicationProperties;
    }

    public String getName() {
        if (null != applicationProperties) {
            return "Plugin name is:" + applicationProperties.getDisplayName();
        }

        return "Jira plugin";
    }
}