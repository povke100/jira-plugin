package lt.povilass.jirap.config;

import com.atlassian.cache.Cache;
import com.atlassian.cache.CacheManager;
import com.atlassian.cache.CacheSettings;
import com.atlassian.cache.CacheSettingsBuilder;
import com.atlassian.cache.memory.MemoryCacheManager;
import com.atlassian.plugins.osgi.javaconfig.configs.beans.ModuleFactoryBean;
import com.atlassian.plugins.osgi.javaconfig.configs.beans.PluginAccessorBean;
import com.atlassian.sal.api.ApplicationProperties;
import lt.povilass.jirap.itunes.ITunesService;
import lt.povilass.jirap.itunes.impl.ITunesServiceImpl;
import lt.povilass.jirap.plugin.api.JiraPComponent;
import lt.povilass.jirap.plugin.impl.JiraPComponentImpl;
import lt.povilass.jirap.rest.dto.ArtistsDto;
import lt.povilass.jirap.service.ArtistsService;
import lt.povilass.jirap.service.impl.ArtistsServiceImpl;
import org.codehaus.jackson.map.ObjectMapper;
import org.osgi.framework.ServiceRegistration;
import org.springframework.beans.factory.FactoryBean;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.web.client.RestTemplate;

import java.util.concurrent.TimeUnit;

import static com.atlassian.plugins.osgi.javaconfig.OsgiServices.exportOsgiService;
import static com.atlassian.plugins.osgi.javaconfig.OsgiServices.importOsgiService;

@Configuration
@Import({
        ModuleFactoryBean.class,
        PluginAccessorBean.class
})
public class JiraPJavaConfig {


    // imports ApplicationProperties from OSGi
    @Bean
    public ApplicationProperties applicationProperties() {
        return importOsgiService(ApplicationProperties.class);
    }

    @Bean
    public JiraPComponent jiraPComponent(ApplicationProperties applicationProperties) {
        return new JiraPComponentImpl(applicationProperties);
    }

    // Exports JiraPComponent as an OSGi service
    @Bean
    public FactoryBean<ServiceRegistration> registerMyDelegatingService(
            final JiraPComponent mypluginComponent) {
        return exportOsgiService(mypluginComponent, null, JiraPComponent.class);
    }

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    @Bean
    public ObjectMapper objectMapper() {
        return new ObjectMapper();
    }

    @Bean
    public ITunesService createITunesService(RestTemplate restTemplate, ObjectMapper objectMapper) {
        return new ITunesServiceImpl(restTemplate, objectMapper);
    }

    @Bean
    public ArtistsService createArtistsService(ITunesService iTunesService) {
        return new ArtistsServiceImpl(iTunesService);
    }

    @Bean
    public CacheManager cacheManager() {

        return new MemoryCacheManager();
    }

    @Bean
    public Cache<String, ArtistsDto> cache(CacheManager cacheManager) {

        CacheSettingsBuilder cacheSettings = new CacheSettingsBuilder();
        cacheSettings.expireAfterWrite(1, TimeUnit.DAYS);

        return cacheManager.getCache("artists", null, cacheSettings.build());
    }
}