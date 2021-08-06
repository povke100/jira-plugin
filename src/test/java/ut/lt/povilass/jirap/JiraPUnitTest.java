package ut.lt.povilass.jirap;

import org.junit.Test;
import lt.povilass.jirap.plugin.api.JiraPComponent;
import lt.povilass.jirap.plugin.impl.JiraPComponentImpl;

import static org.junit.Assert.assertEquals;

public class JiraPUnitTest
{
    @Test
    public void testMyName()
    {
        JiraPComponent component = new JiraPComponentImpl(null);
    }
}