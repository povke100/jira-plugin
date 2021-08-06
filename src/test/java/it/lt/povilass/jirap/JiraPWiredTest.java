package it.lt.povilass.jirap;

import org.junit.Test;
import org.junit.runner.RunWith;
import com.atlassian.plugins.osgi.test.AtlassianPluginsTestRunner;
import lt.povilass.jirap.plugin.api.JiraPComponent;
import com.atlassian.sal.api.ApplicationProperties;

import static org.junit.Assert.assertEquals;

@RunWith(AtlassianPluginsTestRunner.class)
public class JiraPWiredTest
{
    private final ApplicationProperties applicationProperties;
    private final JiraPComponent myPluginComponent;

    public JiraPWiredTest(ApplicationProperties applicationProperties, JiraPComponent myPluginComponent)
    {
        this.applicationProperties = applicationProperties;
        this.myPluginComponent = myPluginComponent;
    }

    @Test
    public void testMyName()
    {

    }
}